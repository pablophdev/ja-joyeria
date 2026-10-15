import { Link } from 'react-router-dom'
import { routes } from '../../navigation/routes'
import { userRoles, userStatuses } from '../../datos/userOptions'
import CamposUsuario from './CamposUsuario'

function FormularioUsuario({ values, busy, onChange, onSubmit, onDelete, creating = false }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={busy}>
        <legend className="h5">Datos de la cuenta</legend>
        <CamposUsuario values={values} onChange={onChange} />
        <p className="small text-secondary">Correos admitidos: @gmail.com, @duoc.cl y @profesor.duoc.cl.</p>
        <div className="row g-3 mb-4">
          <div className="col-sm-6">
            <label className="form-label" htmlFor="edit-password">{creating ? 'Contraseña inicial' : 'Nueva contraseña (opcional)'}</label>
            <input className="form-control" id="edit-password" name="password" type="password" autoComplete="new-password" minLength={6} maxLength={80} required={creating} value={values.password} onChange={onChange} aria-describedby="password-help" />
          </div>
          <div className="col-sm-6">
            <label className="form-label" htmlFor="edit-confirm-password">Confirmar nueva contraseña</label>
            <input className="form-control" id="edit-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={6} maxLength={80} value={values.confirmPassword} onChange={onChange} required={Boolean(values.password)} />
          </div>
          <p className="small text-secondary mb-0" id="password-help">{creating ? 'Ingresa y confirma una contraseña de 6 a 80 caracteres con al menos un número.' : 'Deja ambas contraseñas vacías para conservar la actual.'}</p>
          {[{ name: 'role', label: 'Rol', options: userRoles }, { name: 'status', label: 'Estado', options: userStatuses }].map(({ name, label, options }) => (
            <div className="col-sm-6" key={name}>
              <label className="form-label" htmlFor={`edit-${name}`}>{label}</label>
              <select className="form-select" id={`edit-${name}`} name={name} value={values[name]} onChange={onChange} required>
                {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          ))}
        </div>
        <p className="small text-secondary">En esta demo, los correos @duoc.cl y @profesor.duoc.cl también tienen acceso administrativo, independientemente del rol asignado. Solo las cuentas activas pueden iniciar sesión.</p>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-dark" type="submit">{busy ? 'Guardando…' : creating ? 'Crear usuario' : 'Guardar cambios'}</button>
          <Link className="btn btn-outline-secondary" to={routes.users}>Cancelar</Link>
          {!creating && <button className="btn btn-outline-danger ms-sm-auto" type="button" onClick={onDelete}>Eliminar usuario</button>}
        </div>
      </fieldset>
    </form>
  )
}

export default FormularioUsuario
