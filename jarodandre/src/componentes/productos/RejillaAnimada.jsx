import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { productGridEntrance } from '../../utilidades/motion'

export default function RejillaAnimada({ products, children }) {
  const root = useRef(null)
  const signature = products.map((product) => product.id).join(',')
  useGSAP(() => productGridEntrance(root.current), {
    scope: root, dependencies: [signature], revertOnUpdate: true,
  })
  return <div ref={root} className="row g-4">{children}</div>
}
