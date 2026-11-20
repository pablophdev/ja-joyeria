import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { toothIds } from '../../datos/grillz'

// Modelo original paramétrico: coronas independientes, identificadas y versionadas.
function crownGeometry() {
  const shape = new THREE.Shape()
  shape.moveTo(-0.26, 0.42)
  shape.bezierCurveTo(-0.38, 0.38, -0.36, -0.25, -0.26, -0.41)
  shape.quadraticCurveTo(0, -0.49, 0.26, -0.41)
  shape.bezierCurveTo(0.36, -0.25, 0.38, 0.38, 0.26, 0.42)
  shape.quadraticCurveTo(0, 0.5, -0.26, 0.42)
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.27, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.07, bevelThickness: 0.08, curveSegments: 18 })
  geometry.center()
  return geometry
}

function updateTeeth(teeth, design, options, arch) {
    for (const t of teeth) {
      const selected = design.dientes.find((d) => d.id === t.id)
      const color = options.find((o) => o.codigo === selected?.material)?.color || '#d9ac52'
      t.mesh.material.color.set(selected ? color : '#ece6d9')
      t.mesh.material.metalness = selected ? 1 : 0
      t.mesh.material.roughness = selected ? 0.2 : 0.3
      t.stones.visible = selected?.estilo === 'piedras'
      t.group.visible = arch === 'ambas' || (arch === 'superior' ? t.id.startsWith('S') : t.id.startsWith('I'))
    }
}

export default function VisorGrillz({ design, options, arch = 'ambas', onTooth, apiRef, compact = false }) {
  const mount = useRef(null)
  const sceneRef = useRef(null)
  const action = useRef(onTooth)
  const [error, setError] = useState('')
  useEffect(() => { action.current = onTooth }, [onTooth])
  useEffect(() => {
    const host = mount.current
    let renderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }) }
    catch { queueMicrotask(() => setError('Tu navegador no pudo iniciar la vista 3D. Puedes personalizar con los botones de dientes.')); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    host.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-label', 'Dentadura 3D. Arrastra para girar; usa los botones para seleccionar dientes.')
    renderer.domElement.setAttribute('role', 'img')
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#11171c')
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 1, 12)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, -0.5)
    controls.enablePan = false
    controls.minDistance = 7; controls.maxDistance = 17
    controls.minPolarAngle = Math.PI * 0.28; controls.maxPolarAngle = Math.PI * 0.72
    controls.minAzimuthAngle = -Math.PI * 0.6; controls.maxAzimuthAngle = Math.PI * 0.6
    const room = new RoomEnvironment()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(room)
    scene.environment = environment.texture
    room.dispose(); pmrem.dispose()
    scene.add(new THREE.HemisphereLight(0xe4edff, 0x30231a, 3))
    const light = new THREE.DirectionalLight(0xffe5bf, 4)
    light.position.set(3, 4, 6); scene.add(light)
    const geometry = crownGeometry()
    const stoneGeometry = new THREE.IcosahedronGeometry(0.055, 0)
    const teeth = []
    for (const id of toothIds) {
      const index = Number(id.slice(1)) - 1
      const angle = (index - 3.5) * 0.245
      const upper = id.startsWith('S')
      const group = new THREE.Group()
      group.position.set(Math.sin(angle) * 3.05, upper ? 0.62 : -0.62, Math.cos(angle) * 2.25 - 2.4)
      group.rotation.y = angle
      group.rotation.z = upper ? 0 : Math.PI
      const central = index === 3 || index === 4
      group.scale.set(central ? 1.08 : 0.96, upper ? 1 : 0.82, 1)
      const material = new THREE.MeshStandardMaterial({ color: '#ece6d9', roughness: 0.28 })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.userData.id = id; group.add(mesh)
      const stones = new THREE.Group()
      const stoneMaterial = new THREE.MeshPhysicalMaterial({ color: '#f2faff', metalness: 0.15, roughness: 0.08, clearcoat: 1 })
      for (let row = 0; row < 5; row++) for (let col = 0; col < 4; col++) {
        const stone = new THREE.Mesh(stoneGeometry, stoneMaterial)
        stone.position.set((col - 1.5) * 0.13, (row - 2) * 0.14, 0.23)
        stone.rotation.z = (row + col) * 0.7; stones.add(stone)
      }
      group.add(stones); scene.add(group)
      teeth.push({ id, group, mesh, stones, stoneMaterial })
    }
    const raycaster = new THREE.Raycaster()
    let down = null
    const pointers = new Set()
    const pointerDown = (event) => {
      pointers.add(event.pointerId)
      down = pointers.size === 1 ? [event.clientX, event.clientY] : null
    }
    const pointerCancel = () => { down = null; pointers.clear() }
    const pointerUp = (event) => {
      const start = down
      down = null; pointers.delete(event.pointerId)
      if (!start || pointers.size || Math.hypot(event.clientX - start[0], event.clientY - start[1]) > 6) return
      const rect = renderer.domElement.getBoundingClientRect()
      raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera)
      const hits = raycaster.intersectObjects(teeth.filter((t) => t.group.visible).map((t) => t.mesh))
      if (hits[0]) action.current?.(hits[0].object.userData.id)
    }
    renderer.domElement.addEventListener('pointerdown', pointerDown)
    renderer.domElement.addEventListener('pointerup', pointerUp)
    renderer.domElement.addEventListener('pointercancel', pointerCancel)
    const observer = new ResizeObserver(() => {
      const width = host.clientWidth, height = host.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix()
    })
    observer.observe(host)
    renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera) })
    sceneRef.current = { update: (design, options, arch) => updateTeeth(teeth, design, options, arch) }
    const api = {
      reset: () => { camera.position.set(0, 1, 12); controls.target.set(0, 0, -0.5); controls.update() },
      jpg: (name, description) => {
        renderer.render(scene, camera)
        const output = document.createElement('canvas'); output.width = 1600; output.height = 1300
        const ctx = output.getContext('2d')
        ctx.fillStyle = '#11171c'; ctx.fillRect(0, 0, 1600, 1300)
        const canvas = renderer.domElement
        const ratio = Math.min(1600 / canvas.width, 950 / canvas.height)
        ctx.drawImage(canvas, (1600 - canvas.width * ratio) / 2, 0, canvas.width * ratio, canvas.height * ratio)
        ctx.fillStyle = '#e8c990'; ctx.font = 'bold 32px sans-serif'; ctx.fillText('JARODANDRE / GRILLZ STUDIO', 60, 1010)
        ctx.fillStyle = '#ffffff'; ctx.font = '26px sans-serif'; ctx.fillText(name.slice(0, 80), 60, 1060)
        ctx.font = '20px sans-serif'
        let line = '', y = 1100
        for (const word of description.split(' ')) {
          if (ctx.measureText(line + word).width > 1470) { ctx.fillText(line, 60, y); line = ''; y += 28 }
          line += word + ' '
        }
        ctx.fillText(line, 60, y)
        ctx.fillStyle = '#b5bdc4'; ctx.fillText('Referencia visual. Ajuste y precio final sujetos a cotización y molde.', 60, 1260)
        output.toBlob((blob) => {
          if (!blob) return
          const url = URL.createObjectURL(blob), link = document.createElement('a')
          link.href = url; link.download = 'jarodandre-grillz.jpg'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
        }, 'image/jpeg', 0.94)
      },
    }
    if (apiRef) apiRef.current = api
    return () => {
      if (apiRef) apiRef.current = null
      sceneRef.current = null; observer.disconnect(); renderer.setAnimationLoop(null); controls.dispose()
      renderer.domElement.removeEventListener('pointerdown', pointerDown); renderer.domElement.removeEventListener('pointerup', pointerUp)
      renderer.domElement.removeEventListener('pointercancel', pointerCancel)
      geometry.dispose(); stoneGeometry.dispose()
      for (const t of teeth) { t.mesh.material.dispose(); t.stoneMaterial.dispose() }
      environment.dispose(); renderer.dispose(); host.replaceChildren()
    }
  }, [apiRef])
  useEffect(() => {
    sceneRef.current?.update(design, options, arch)
  }, [design, options, arch])
  return <div className={`grillz-viewport ${compact ? 'grillz-viewport--compact' : ''}`}><div ref={mount} className="grillz-canvas" />{error && <p className="grillz-webgl-error" role="alert">{error}</p>}</div>
}
