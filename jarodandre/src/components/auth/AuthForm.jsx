import { registrationRegions } from '../../data/registrationOptions'

const fields = [
  { name: 'name', label: 'Nombre completo', type: 'text', autoComplete: 'name', maxLength: 120 },
  { name: 'rut', label: 'RUT / RUN', type: 'text', placeholder: '12345678-5', maxLength: 12 },
  { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'confirmEmail', label: 'Confirmar correo', type: 'email', maxLength: 254 },
  { name: 'password', label: 'Contraseña', type: 'password', minLength: 6, maxLength: 128 },
  { name: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', minLength: 6, maxLength: 128, autoComplete: 'new-password' },
  { name: 'phone', label: 'Teléfono (opcional)', type: 'tel', autoComplete: 'tel', maxLength: 12 },
]

function AuthForm({ mode, values, busy, onChange, onSubmit }) {
  const isRegister = mode === 'register'
  const communes = registrationRegions.find((region) => region.value === values.region)?.communes ?? []
  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={busy}>
        <legend className="visually-hidden">{isRegister ? 'Registro de cuenta' : 'Datos de acceso'}</legend>
        {fields.filter((field) => isRegister || ['email', 'password'].includes(field.name)).map(({ name, label, ...inputProps }) => (
          <div className="mb-3" key={name}>
            <label className="form-label" htmlFor={`auth-${name}`}>{label}</label>
            <input {...inputProps} className="form-control" id={`auth-${name}`} name={name} required={name !== 'phone'}
              autoComplete={name === 'password' ? (isRegister ? 'new-password' : 'current-password') : inputProps.autoComplete}
              value={values[name]} onChange={onChange} />
          </div>
        ))}
        {isRegister && (
          <>
            <p className="small text-secondary">Correos admitidos: @gmail.com, @duoc.cl y @profesor.duoc.cl. Contraseña de 6 a 128 caracteres.</p>
            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label" htmlFor="auth-region">Región</label>
                <select className="form-select" id="auth-region" name="region" required value={values.region} onChange={onChange}>
                  <option value="">Selecciona la región</option>
                  {registrationRegions.map((region) => <option key={region.value} value={region.value}>{region.label}</option>)}
                </select>
              </div>
              <div className="col-sm-6">
                <label className="form-label" htmlFor="auth-commune">Comuna</label>
                <select className="form-select" id="auth-commune" name="commune" required disabled={!values.region} value={values.commune} onChange={onChange}>
                  <option value="">Selecciona la comuna</option>
                  {communes.map((commune) => <option key={commune} value={commune}>{commune}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
        <button className="btn btn-dark w-100" type="submit">{busy ? 'Procesando…' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</button>
      </fieldset>
    </form>
  )
}

export default AuthForm
