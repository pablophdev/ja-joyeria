import { Link } from 'react-router-dom'
import { routes } from '../../navigation/routes'
import VistaPreviaImagen from './VistaPreviaImagen'

const textFields = [
  { name: 'name', label: 'Nombre', required: true },
  { name: 'category', label: 'Categoría' },
  { name: 'tags', label: 'Etiquetas (separadas por comas)' },
]

function FormularioProducto({ values, onChange, onImageChange, imageLoading, imageError, imageName, onSubmit, isEditing }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="row g-3">
        {textFields.map(({ name, label, required }) => <div className={name === 'name' ? 'col-12' : 'col-md-6'} key={name}><label className="form-label" htmlFor={`product-${name}`}>{label}</label><input className="form-control" id={`product-${name}`} name={name} required={required} value={values[name]} onChange={onChange} /></div>)}
        <div className="col-md-6"><label className="form-label" htmlFor="product-price">Precio (CLP)</label><input className="form-control" id="product-price" name="price" type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="1" required value={values.price} onChange={onChange} /></div>
        <div className="col-md-6"><label className="form-label" htmlFor="product-availability">Disponibilidad</label><input className="form-control" id="product-availability" list="product-availability-options" name="availability" value={values.availability} onChange={onChange} /><datalist id="product-availability-options"><option value="En stock" /><option value="Agotado" /><option value="Consultar disponibilidad" /></datalist></div>
        <div className="col-md-6"><label className="form-label" htmlFor="product-group">Grupo</label><select className="form-select" id="product-group" name="group" value={values.group} onChange={onChange}><option value="new">Nuevos</option><option value="popular">Populares</option></select></div>
        <div className="col-md-6"><label className="form-label" htmlFor="product-badge">Etiqueta de promoción</label><select className="form-select" id="product-badge" name="badge" value={values.badge} onChange={onChange}><option value="">Sin etiqueta</option><option value="Nuevo">Nuevo</option><option value="Oferta">Oferta</option></select></div>
        <div className="col-md-6"><label className="form-label" htmlFor="product-rating">Valoración (0–5)</label><input className="form-control" id="product-rating" name="rating" type="number" min="0" max="5" step="1" required value={values.rating} onChange={onChange} /></div>
        <div className="col-md-6"><label className="form-label" htmlFor="product-reviewCount">Cantidad de reseñas</label><input className="form-control" id="product-reviewCount" name="reviewCount" type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="1" required value={values.reviewCount} onChange={onChange} /></div>
        <div className="col-12"><label className="form-label" htmlFor="product-description">Descripción</label><textarea className="form-control" id="product-description" name="description" rows="4" value={values.description} onChange={onChange} /></div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="product-image">Imagen del producto</label>
          <input className="form-control" id="product-image" name="imageFile" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" required={!values.image} onChange={onImageChange} aria-invalid={Boolean(imageError)} aria-describedby="product-image-help product-image-status" />
          <p className="form-text" id="product-image-help">Selecciona una imagen JPG, PNG o WebP desde tu computador (máximo 10 MB). Se optimizará a un máximo de 1200 píxeles y se guardará localmente con el producto.</p>
          {isEditing && <p className="small text-secondary">Si no eliges otra imagen, se conservará la actual.</p>}
          <p id="product-image-status" className={imageError ? 'text-danger' : 'text-secondary'} role="status">{imageLoading ? 'Preparando imagen…' : imageError || (imageName ? `Imagen seleccionada: ${imageName}` : '')}</p>
        </div>
        <div className="col-md-6"><VistaPreviaImagen key={values.image} src={values.image} /></div>
        <div className="col-12"><div className="form-check"><input className="form-check-input" id="product-featured" name="featured" type="checkbox" checked={values.featured} onChange={onChange} /><label className="form-check-label" htmlFor="product-featured">Mostrar como producto destacado en el inicio</label></div></div>
      </div>
      <div className="d-flex flex-wrap gap-2 mt-4"><button className="btn btn-dark" type="submit" disabled={imageLoading || Boolean(imageError)}>{imageLoading ? 'Preparando imagen…' : isEditing ? 'Guardar cambios' : 'Crear producto'}</button><Link className="btn btn-outline-secondary" to={routes.adminProducts}>Cancelar</Link></div>
    </form>
  )
}

export default FormularioProducto
