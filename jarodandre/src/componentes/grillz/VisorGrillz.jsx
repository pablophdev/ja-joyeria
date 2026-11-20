import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createDentalModel } from './modeloDental'

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
    renderer.toneMappingExposure = 1.05
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
    scene.add(new THREE.HemisphereLight(0xe4edff, 0x30231a, 1.6))
    const light = new THREE.DirectionalLight(0xffe5bf, 2.5)
    light.position.set(3, 4, 6); scene.add(light)
    const model = createDentalModel(scene, design.modelo)
    const teeth = model.teeth
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
      const hits = raycaster.intersectObjects(teeth.filter((t) => t.group.visible).map((t) => t.group), true)
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
    sceneRef.current = model
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
      model.dispose()
      environment.dispose(); renderer.dispose(); host.replaceChildren()
    }
  }, [apiRef, design.modelo])
  useEffect(() => {
    sceneRef.current?.update(design, options, arch)
  }, [design, options, arch])
  return <div className={`grillz-viewport ${compact ? 'grillz-viewport--compact' : ''}`}><div ref={mount} className="grillz-canvas" />{error && <p className="grillz-webgl-error" role="alert">{error}</p>}</div>
}
