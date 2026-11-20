import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, subscribeToAuth } from '../datos/auth'
import { MODEL, estimateGrillz, getGrillzOptions, getMyGrillz, initialDesign, quoteGrillz, saveGrillz, toothIds, restoreGrillzDraft, storeGrillzDraft } from '../datos/grillz'
import { formatPrice } from '../utilidades/formatPrice'
import './PersonalizadorGrillz.css'
const Visor = lazy(() => import('../componentes/grillz/VisorGrillz'))

export default function PersonalizadorGrillz() {
  const [design, setDesign] = useState(restoreGrillzDraft)
  const [options, setOptions] = useState([])
  const [arch, setArch] = useState('ambas')
  const [material, setMaterial] = useState(() => design.dientes[0]?.material || 'dorado')
  const [style, setStyle] = useState(() => design.dientes[0]?.estilo || 'liso')
  const [estimate, setEstimate] = useState(null)
  const [user, setUser] = useState(getCurrentUser)
  const [saved, setSaved] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const api = useRef(null)
  const persisted = useRef(null)
  useEffect(() => { storeGrillzDraft(design) }, [design])
  useEffect(() => subscribeToAuth(() => setUser(getCurrentUser())), [])
  useEffect(() => { let active = true; getGrillzOptions().then((data) => { if (active) setOptions(data) }).catch((e) => { if (active) setError(e.message) }); return () => { active = false } }, [])
  useEffect(() => {
    if (!user) return
    let active = true
    getMyGrillz().then((data) => { if (active) setSaved(data) }).catch((e) => { if (active) setError(e.message) })
    return () => { active = false }
  }, [user])
  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      if (!design.dientes.length || !design.nombre.trim()) { setEstimate(null); return }
      estimateGrillz(design).then((data) => { if (active) setEstimate(data.estimadoClp) }).catch((e) => { if (active) { setEstimate(null); setError(e.message) } })
    }, 350)
    return () => { active = false; clearTimeout(timer) }
  }, [design])
  function change(next) { setDesign(next); setEstimate(null); setMessage(''); setError('') }
  function toggle(id) {
    change({ ...design, dientes: design.dientes.some((d) => d.id === id) ? design.dientes.filter((d) => d.id !== id) : [...design.dientes, { id, material, estilo: style }] })
  }
  function selectArch(prefix) {
    const ids = toothIds.filter((id) => id.startsWith(prefix))
    change({ ...design, dientes: [...design.dientes.filter((d) => !ids.includes(d.id)), ...ids.map((id) => ({ id, material, estilo: style }))] })
  }
  async function persist(quote) {
    setBusy(true); setError(''); setMessage('')
    try {
      const signature = JSON.stringify(design)
      let result = persisted.current?.signature === signature ? persisted.current : null
      if (!result) {
        const created = await saveGrillz(design)
        result = { id: created.id, signature }
        persisted.current = result
      }
      if (quote) await quoteGrillz(result.id)
      setSaved(await getMyGrillz())
      setMessage(quote ? 'Solicitud enviada. Puedes revisar el diseño en tus diseños guardados.' : 'Diseño guardado en tu cuenta.')
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  async function requestSaved(id) {
    setBusy(true); setError('')
    try { await quoteGrillz(id); setSaved(await getMyGrillz()); setMessage('Solicitud de cotización enviada.') }
    catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  const materials = options.filter((o) => o.tipo === 'MATERIAL')
  const styleOrder = ['liso','piedras','ventana','solitario','colmillo','rayas','corazon']
  const styles = options.filter((o) => o.tipo === 'ESTILO').sort((a,b) => styleOrder.indexOf(a.codigo) - styleOrder.indexOf(b.codigo))
  const styleIcons = { liso: '▰', piedras: '⠿', ventana: '▱', solitario: '◇', colmillo: '▽', rayas: '≋', corazon: '♥' }
  function chooseStyle(code) {
    setStyle(code)
    change({ ...design, modelo: MODEL, dientes: design.dientes.map((d) => ({ ...d, estilo: code })) })
  }
  const canSave = user && design.dientes.length > 0 && design.nombre.trim() && estimate !== null && !busy
  const summary = `${design.dientes.length} dientes · ${design.dientes.map((d) => `${d.id} ${d.material}/${d.estilo}`).join(', ')}`
  return <section className="grillz-studio container py-5">
    <div className="grillz-heading"><div><p className="grillz-eyebrow">JARODANDRE / DISEÑO A TU MEDIDA</p><h1>Tu sonrisa.<br /><span>Tus reglas.</span></h1><p>Crea tus grillz, prueba acabados y dale forma a tu idea.</p></div><span className="grillz-tag">GRILLZ STUDIO · 3D</span></div>
    {error && <p role="alert" className="alert alert-danger">{error}</p>}
    <div className="grillz-layout">
      <div className="grillz-stage"><div className="grillz-stage-head"><span>VISTA PREVIA EN 3D</span><span>{design.dientes.length} DIENTES</span></div>
        <Suspense fallback={<div className="grillz-viewport p-5" role="status">Preparando el estudio 3D…</div>}><Visor design={design} options={options} arch={arch} onTooth={toggle} apiRef={api} /></Suspense>
        <div className="grillz-toolbar"><select aria-label="Arcada visible" value={arch} onChange={(e) => setArch(e.target.value)}><option value="ambas">Ambas arcadas</option><option value="superior">Superior</option><option value="inferior">Inferior</option></select><button onClick={() => api.current?.reset()}>Centrar vista</button></div>
        <p className="grillz-hint">Arrastra para girar · Acerca con dos dedos o la rueda · Toca un diente para cubrirlo</p>
      </div>
      <aside className="grillz-settings" aria-label="Personalizar grillz">
        <label htmlFor="grillz-name">Nombre del diseño</label><input id="grillz-name" maxLength={100} value={design.nombre} onChange={(e) => change({ ...design, nombre: e.target.value })} />
        <h2><span>01</span> Elige tus dientes</h2>
        {['S','I'].map((prefix) => <div key={prefix}><div className="grillz-row-label"><span>{prefix === 'S' ? 'Superior' : 'Inferior'} · de izquierda a derecha en pantalla</span><button onClick={() => selectArch(prefix)}>Todos</button></div><div className="grillz-tooth-grid">{toothIds.filter((id) => id.startsWith(prefix)).map((id) => <button key={id} aria-pressed={design.dientes.some((d) => d.id === id)} aria-label={`Diente ${id}`} onClick={() => toggle(id)}>{id}</button>)}</div></div>)}
        <h2><span>02</span> Define el acabado</h2>
        <div className="grillz-swatches">{materials.map((o) => <button key={o.codigo} aria-pressed={material === o.codigo} onClick={() => setMaterial(o.codigo)}><i style={{ background: o.color }} />{o.nombre}</button>)}</div>
        <p className="grillz-note">Diseño para los dientes cubiertos</p><div className="grillz-design-grid" role="group" aria-label="Diseños de grillz">{styles.map((o) => <button key={o.codigo} aria-pressed={style === o.codigo} onClick={() => chooseStyle(o.codigo)}><span aria-hidden="true">{styleIcons[o.codigo] || '◇'}</span><strong>{o.nombre}</strong><small>{o.precioClp ? `+ ${formatPrice(o.precioClp)} por diente` : 'Sin recargo de diseño'}</small></button>)}</div>
        <p className="grillz-note">El diseño se aplica a los dientes cubiertos. El material elegido se usa en los dientes que añadas; para cambiarlo en todos, usa el botón de abajo.</p>
        <button className="grillz-secondary" disabled={!design.dientes.length || !options.length} onClick={() => change({ ...design, dientes: design.dientes.map((d) => ({ ...d, material, estilo: style })) })}>Aplicar a los dientes cubiertos</button>
        <div className="grillz-price"><span>Estimado de diseño</span><strong>{!design.dientes.length ? formatPrice(0) : estimate === null ? 'Calculando…' : formatPrice(estimate)}</strong><small>CLP · El precio final y el ajuste se confirman con cotización y molde. Acabados de referencia.</small></div>
        <button className="grillz-primary" disabled={!design.dientes.length} onClick={() => { if (!api.current) { setError('La vista 3D no está disponible para exportar.'); return } api.current.jpg(design.nombre || 'Mis grillz', summary) }}>Descargar diseño JPG ↓</button>
        {user ? <><button className="grillz-secondary" disabled={!canSave} onClick={() => persist(false)}>{busy ? 'Guardando…' : 'Guardar en mi cuenta'}</button><button className="grillz-secondary" disabled={!canSave} onClick={() => persist(true)}>Solicitar cotización</button></> : <p className="grillz-note"><Link to="/login">Inicia sesión</Link> para guardar tu diseño o solicitar una cotización. Puedes descargar el JPG sin una cuenta.</p>}
        <button className="grillz-reset" onClick={() => { change(initialDesign()); setStyle('liso'); setMaterial('dorado'); setArch('ambas'); api.current?.reset() }}>Restablecer diseño</button>
      </aside>
    </div>
    <p role="status" className="mt-3">{message}</p>
    {design.modelo === 'arcada-v1' && <p className="grillz-note">Este diseño usa el modelo anterior. <button className="grillz-secondary" onClick={() => change({ ...design, modelo: MODEL })}>Actualizar al modelo con encías</button></p>}
    <p className="grillz-disclaimer">Vista 3D de referencia para explorar el diseño. La fabricación requiere confirmar materiales, medidas y molde.</p>
    {user && <section className="mt-5"><h2>Mis diseños</h2>{!saved.length ? <p>Aquí aparecerán los diseños que guardes.</p> : <div className="grillz-saved">{saved.map((item) => <article key={item.id}><p className="grillz-eyebrow">{item.estado === 'SOLICITADO' ? 'COTIZACIÓN SOLICITADA' : 'GUARDADO'}</p><h3>{item.nombre}</h3><p>{item.configuracion.dientes.length} dientes · {formatPrice(item.estimadoClp)}</p><button className="grillz-secondary" onClick={() => { persisted.current = { id: item.id, signature: JSON.stringify(item.configuracion) }; setStyle(item.configuracion.dientes[0]?.estilo || 'liso'); setMaterial(item.configuracion.dientes[0]?.material || 'dorado'); change(item.configuracion); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Abrir diseño</button>{item.estado !== 'SOLICITADO' && <button className="grillz-secondary" disabled={busy} onClick={() => requestSaved(item.id)}>Pedir cotización</button>}</article>)}</div>}</section>}
  </section>
}
