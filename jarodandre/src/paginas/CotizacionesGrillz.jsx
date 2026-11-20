import { Link } from 'react-router-dom'
import { getUserEditPath } from '../navigation/routes'
import { lazy, Suspense, useEffect, useState } from 'react'
import { getGrillzOptions, getGrillzQuotes } from '../datos/grillz'
import { formatPrice } from '../utilidades/formatPrice'
import './PersonalizadorGrillz.css'
const Visor = lazy(() => import('../componentes/grillz/VisorGrillz'))
export default function CotizacionesGrillz() {
  const [items, setItems] = useState([]), [options, setOptions] = useState([]), [selected, setSelected] = useState(null), [error, setError] = useState(''), [loading, setLoading] = useState(true)
  useEffect(() => { let active = true
    Promise.all([getGrillzQuotes(), getGrillzOptions()]).then(([quotes, opts]) => { if (active) { setItems(quotes); setOptions(opts) } }).catch((e) => { if (active) setError(e.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  return <section className="grillz-studio"><h1>Cotizaciones de grillz</h1><p>Diseños que los clientes enviaron para revisar materiales, ajuste y presupuesto.</p>{error && <p role="alert">{error}</p>}{loading ? <p role="status">Cargando solicitudes…</p> : !items.length ? <p>Todavía no hay solicitudes.</p> : <div className="grillz-saved">{items.map((item) => <article key={item.id}><h2 className="h5">{item.nombre}</h2><p>{item.autor} · {new Date(item.creadoEn).toLocaleDateString('es-CL')}</p><p><Link to={getUserEditPath(item.usuarioId)}>Ver datos de la cuenta</Link></p><p>{formatPrice(item.estimadoClp)} · {item.configuracion.dientes.length} dientes</p><button className="grillz-secondary" onClick={() => setSelected(item)}>Ver diseño 3D</button></article>)}</div>}{selected && <section className="mt-4"><h2>{selected.nombre}</h2><p>Referencia: {selected.id}</p><Suspense fallback={<p>Cargando vista…</p>}><Visor design={selected.configuracion} options={options} compact /></Suspense><ul>{selected.configuracion.dientes.map((d) => <li key={d.id}>{d.id}: {d.material}, {d.estilo}</li>)}</ul><button className="grillz-secondary" onClick={() => setSelected(null)}>Cerrar vista</button></section>}</section>
}
