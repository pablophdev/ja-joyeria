// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { createDentalModel } from '../componentes/grillz/modeloDental'
const design = (estilo) => ({ modelo: 'arcada-v2', dientes: [{ id: 'S4', material: 'dorado', estilo }] })
describe('Modelo dental', () => {
  it('crea dientes distintos, encías y geometría válida para la nueva versión', () => {
    const scene = new THREE.Scene(), model = createDentalModel(scene, 'arcada-v2')
    expect(model.teeth).toHaveLength(16)
    expect(new Set(model.teeth.map((t) => t.id)).size).toBe(16)
    expect(scene.children.filter((o) => o.isMesh)).toHaveLength(2)
    const central = model.teeth.find((t) => t.id === 'S4').mesh.geometry
    const canine = model.teeth.find((t) => t.id === 'S2').mesh.geometry
    expect(Array.from(central.attributes.position.array)).not.toEqual(Array.from(canine.attributes.position.array))
    scene.traverse((o) => { if (o.geometry) expect(Array.from(o.geometry.attributes.position.array).every(Number.isFinite)).toBe(true) })
    model.dispose()
  })
  it('el marco deja visible el esmalte y cada diseño activa su propio detalle', () => {
    const model = createDentalModel(new THREE.Scene(), 'arcada-v2')
    for (const style of ['ventana','solitario','colmillo','rayas','corazon','piedras']) {
      model.update(design(style), [], 'superior')
      const tooth = model.teeth.find((t) => t.id === 'S4')
      expect(tooth.cap.visible).toBe(style !== 'ventana')
      expect(Object.entries(tooth.decorations).filter(([, group]) => group.visible).map(([code]) => code)).toEqual([style])
      expect(model.teeth.find((t) => t.id === 'I4').group.visible).toBe(false)
    }
    model.dispose()
  })
  it('conserva los modelos anteriores y permite seleccionar dientes con piedras', () => {
    const model = createDentalModel(new THREE.Scene(), 'arcada-v1')
    model.update(design('piedras'), [], 'ambas')
    const tooth = model.teeth.find((t) => t.id === 'S4')
    tooth.group.traverse((o) => { expect(o.userData.id).toBe('S4') })
    expect(tooth.stones.visible).toBe(true)
    model.dispose()
  })
})
