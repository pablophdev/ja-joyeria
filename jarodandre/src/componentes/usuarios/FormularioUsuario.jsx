import { Link } from 'react-router-dom'
import { routes } from '../../navigation/routes'
import { userRoles, userStatuses } from '../../datos/userOptions'

export default function FormularioUsuario({ values, busy, onChange, onSubmit }) {
  return <form onSubmit={onSubmit}><fieldset disabled={busy}>
    <legend className="h5">Permisos de acceso</legend>
    <p>{values.name} · {values.email} · {values.rut}</p>
    <p>La API permite cambiar únicamente el rol y el estado. La identidad y la contraseña se gestionan en Cognito; los datos personales los modifica su titular.</p>
    <div className="row g-3 mb-4">
      {[{ name: 'role', label: 'Rol', options: userRoles }, { name: 'status', label: 'Estado', options: userStatuses }].map(({ name, label, options }) => <div className="col-sm-6" key={name}>
        <label className="form-label" htmlFor={`edit-${name}`}>{label}</label>
        <select className="form-select" id={`edit-${name}`} name={name} value={values[name]} onChange={onChange} required>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>)}
    </div>
    <button className="btn btn-dark me-2" type="submit">{busy ? 'Guardando…' : 'Guardar acceso'}</button><Link to={routes.users}>Cancelar</Link>
  </fieldset></form>
}
