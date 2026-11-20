import * as THREE from 'three'
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

function updateLegacy(teeth, design, options, arch) {
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


function legacyModel(scene) {
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
      group.add(stones); group.traverse((o) => { o.userData.id = id }); scene.add(group)
      teeth.push({ id, group, mesh, stones, stoneMaterial })
    }
    return { teeth, update: (design,options,arch) => updateLegacy(teeth,design,options,arch),
      dispose: () => { geometry.dispose();stoneGeometry.dispose();for(const t of teeth){t.mesh.material.dispose();t.stoneMaterial.dispose()} } }
}

const isVisible = (id,arch) => arch === 'ambas' || (arch === 'superior' ? id.startsWith('S') : id.startsWith('I'))

// A closed crown built from curved cross-sections: narrow neck, convex labial surface,
// flatter incisal edge and a distinct cusp on canines/premolars.
function dentalCrown(type,width,height) {
  const positions=[], colors=[], indices=[], rings=28, segments=48
  const canine=type === 'canine', premolar=type === 'premolar'
  for(let ring=0;ring<=rings;ring++) {
    const t=ring/rings
    const neck=1-0.22*Math.pow(t,4)
    const tip=canine ? 0.09+0.91*Math.sin(Math.min(t/0.27,1)*Math.PI/2) : 0.9+0.1*Math.sin(t*Math.PI)
    for(let slice=0;slice<=segments;slice++) {
      const angle=slice/segments*Math.PI*2, c=Math.cos(angle), sn=Math.sin(angle)
      const x=Math.sign(c)*Math.pow(Math.abs(c),0.62)*width/2*neck*tip
      const depth=(premolar ? 0.25 : 0.18)*(0.75+0.25*Math.sin(t*Math.PI))
      const z=Math.sign(sn)*Math.pow(Math.abs(sn),0.72)*depth*(0.45+0.55*Math.sin(Math.min(t/0.18,1)*Math.PI/2))
        + (sn>0 ? 0.07*Math.sin(t*Math.PI) : 0)
      const edge=(premolar ? 0.07*Math.cos(angle*2) : 0.015*Math.cos(angle*3))*(1-t)**8
      positions.push(x, (t-0.5)*height+edge, z)
      const color=new THREE.Color().lerpColors(new THREE.Color('#fff9e9'),new THREE.Color('#d4bf99'),0.24*Math.pow(t,3))
      colors.push(color.r,color.g,color.b)
    }
  }
  for(let r=0;r<rings;r++) for(let i=0;i<segments;i++) {
    const a=r*(segments+1)+i,b=a+segments+1
    indices.push(a,b,a+1,b,b+1,a+1)
  }
  // End caps keep the crown closed when the user rotates the model.
  for(const ring of [0,rings]) {
    const center=positions.length/3
    positions.push(0,(ring/rings-0.5)*height,0);colors.push(1,0.96,0.86)
    for(let i=0;i<segments;i++) {
      const a=ring*(segments+1)+i
      if(ring===0) indices.push(center,a,a+1); else indices.push(center,a+1,a)
    }
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
  geometry.setIndex(indices);geometry.computeVertexNormals()
  return geometry
}

function gingiva(upper) {
  const positions=[],colors=[],indices=[], steps=160,radial=28,sign=upper?1:-1
  for(let i=0;i<=steps;i++) {
    const angle=-0.91+i/steps*1.82
    for(let j=0;j<=radial;j++) {
      const phi=j/radial*Math.PI*2
      const scallop=0.08*Math.cos((angle/0.22+3.5)*Math.PI*2)*Math.max(0,-Math.sin(phi))
      const radius=0.34
      positions.push(Math.sin(angle)*((upper?3.2:2.95)+Math.cos(phi)*radius),sign*(1.43+Math.sin(phi)*0.30+scallop),Math.cos(angle)*((upper?2.6:2.4)+Math.cos(phi)*radius)-2.7)
      const color=new THREE.Color().lerpColors(new THREE.Color('#bd686e'),new THREE.Color('#e5a0a0'),0.4+0.22*Math.cos(phi)+0.08*Math.sin(angle*13))
      colors.push(color.r,color.g,color.b)
    }
  }
  for(let i=0;i<steps;i++)for(let j=0;j<radial;j++) {
    const a=i*(radial+1)+j,b=a+radial+1
    indices.push(a,a+1,b,b,a+1,b+1)
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals()
  return new THREE.Mesh(g,new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:0.48,clearcoat:0.22,side:THREE.DoubleSide}))
}

function heartGeometry() {
  const s=new THREE.Shape()
  s.moveTo(0,-0.20);s.bezierCurveTo(-0.4,0.06,-0.23,0.36,0,0.17);s.bezierCurveTo(0.23,0.36,0.4,0.06,0,-0.20)
  return new THREE.ExtrudeGeometry(s,{depth:0.035,bevelEnabled:true,bevelSize:0.015,bevelThickness:0.015,bevelSegments:3,steps:1,curveSegments:16})
}

function realisticModel(scene) {
  const teeth=[], gums=[gingiva(true),gingiva(false)]
  gums.forEach((g)=>scene.add(g))
  for(const id of toothIds) {
    const index=Number(id.slice(1))-1,upper=id.startsWith('S'),angle=(index-3.5)*0.22
    const type=[0,7].includes(index)?'premolar':[1,6].includes(index)?'canine':'incisor'
    const central=[3,4].includes(index)
    const width=(central?0.74:type==='canine'?0.67:type==='premolar'?0.69:0.62)*(upper?1:0.91)
    const height=(central?1.12:type==='canine'?1.15:type==='premolar'?0.89:0.99)*(upper?1:0.85)
    const group=new THREE.Group()
    group.position.set(Math.sin(angle)*(upper?3.2:2.95),(upper?1:-1)*(1.22-height/2),Math.cos(angle)*(upper?2.6:2.4)-2.7)
    group.rotation.y=angle;group.rotation.z=upper?0:Math.PI
    const geometry=dentalCrown(type,width,height)
    const enamel=new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:0.26,clearcoat:0.35,clearcoatRoughness:0.2,metalness:0})
    const mesh=new THREE.Mesh(geometry,enamel);group.add(mesh)
    const metal=new THREE.MeshStandardMaterial({color:'#d9ac52',metalness:1,roughness:0.24})
    const cap=new THREE.Mesh(geometry,metal);cap.scale.setScalar(1.025);cap.position.z=0.015;group.add(cap)
    const decorations={}
    for(const style of ['piedras','ventana','solitario','colmillo','rayas','corazon']) {decorations[style]=new THREE.Group();group.add(decorations[style])}
    const gemMaterial=new THREE.MeshPhysicalMaterial({color:'#f0f8ff',metalness:0.08,roughness:0.06,clearcoat:1})
    const stoneGeometry=new THREE.IcosahedronGeometry(0.055,1)
    for(let row=0;row<5;row++)for(let col=0;col<4;col++) {
      const stone=new THREE.Mesh(stoneGeometry,gemMaterial)
      stone.position.set((col-1.5)*width*0.19,(row-2)*height*0.14,0.24)
      stone.rotation.set(0.3,row*0.4,col*0.6);decorations.piedras.add(stone)
    }
    // Open face frame: only the rim is metal, leaving enamel in the center.
    const points=[]
    for(let i=0;i<=64;i++) {
      const a=i/64*Math.PI*2,c=Math.cos(a),sn=Math.sin(a)
      points.push(new THREE.Vector3(Math.sign(c)*Math.pow(Math.abs(c),0.6)*width*0.43,Math.sign(sn)*Math.pow(Math.abs(sn),0.6)*height*0.42,0.21+0.035*Math.abs(c)))
    }
    decorations.ventana.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),80,0.028,8,false),metal))
    const setting=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.15,0.08,8),metal)
    setting.rotation.x=Math.PI/2;setting.position.z=0.25;decorations.solitario.add(setting)
    const solitaire=new THREE.Mesh(new THREE.IcosahedronGeometry(0.18,0),gemMaterial);solitaire.position.z=0.33;decorations.solitario.add(solitaire)
    const fang=new THREE.Mesh(new THREE.ConeGeometry(width*0.3,0.62,32),metal)
    fang.rotation.z=Math.PI;fang.position.set(0,-height/2-0.13,0.04);decorations.colmillo.add(fang)
    const groove=new THREE.MeshStandardMaterial({color:'#34291e',metalness:0.6,roughness:0.5})
    for(const y of [-0.20,0,0.20]) {
      const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-width*0.38,y-0.06,0.23),new THREE.Vector3(0,y,0.29),new THREE.Vector3(width*0.38,y+0.06,0.23)])
      decorations.rayas.add(new THREE.Mesh(new THREE.TubeGeometry(curve,24,0.014,6,false),groove))
    }
    const heart=new THREE.Mesh(heartGeometry(),new THREE.MeshStandardMaterial({color:'#a22f50',metalness:0.55,roughness:0.22}));heart.position.z=0.25;decorations.corazon.add(heart)
    group.traverse((o)=>{o.userData.id=id});scene.add(group)
    teeth.push({id,group,mesh,cap,metal,decorations})
  }
  return {teeth,
    update(design,options,arch) {
      gums[0].visible=arch!=='inferior';gums[1].visible=arch!=='superior'
      for(const t of teeth) {
        const d=design.dientes.find((x)=>x.id===t.id)
        t.group.visible=isVisible(t.id,arch)
        t.metal.color.set(options.find((o)=>o.codigo===d?.material)?.color || '#d9ac52')
        t.cap.visible=Boolean(d)&&d.estilo!=='ventana'
        for(const [style,decoration]of Object.entries(t.decorations))decoration.visible=d?.estilo===style
      }
    },
    dispose() {
      const geometries=new Set(),materials=new Set()
      for(const obj of [...teeth.map((t)=>t.group),...gums])obj.traverse((o)=>{
        if(o.geometry)geometries.add(o.geometry)
        if(o.material)materials.add(o.material)
      })
      geometries.forEach((g)=>g.dispose());materials.forEach((m)=>m.dispose())
    },
  }
}
export function createDentalModel(scene,version) {return version === 'arcada-v1' ? legacyModel(scene) : realisticModel(scene)}
