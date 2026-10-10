import UserProfileFields from '../users/UserProfileFields'

const fields = [
  { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'confirmEmail', label: 'Confirmar correo', type: 'email', maxLength: 254 },
  { name: 'password', label: 'Contraseña', type: 'password', minLength: 6, maxLength: 128 },
  { name: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', minLength: 6, maxLength: 128, autoComplete: 'new-password' },
]

function AuthForm({ mode, values, busy, onChange, onSubmit }) {
  const isRegister = mode === 'register'
  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={busy}>
        <legend className="visually-hidden">{isRegister ? 'Registro de cuenta' : 'Datos de acceso'}</legend>
        {isRegister && <UserProfileFields values={values} onChange={onChange} />}
        {fields.filter((field) => isRegister ? field.name !== 'email' : ['email', 'password'].includes(field.name)).map(({ name, label, ...inputProps }) => (
          <div className="mb-3" key={name}>
            <label className="form-label" htmlFor={`auth-${name}`}>{label}</label>
            <input {...inputProps} className="form-control" id={`auth-${name}`} name={name} required
              autoComplete={name === 'password' ? (isRegister ? 'new-password' : 'current-password') : inputProps.autoComplete}
              value={values[name]} onChange={onChange} />
          </div>
        ))}
        {isRegister && <p className="small text-secondary">Correos admitidos: @gmail.com, @duoc.cl y @profesor.duoc.cl. Contraseña de 6 a 128 caracteres.</p>}
        <button className="btn btn-dark w-100" type="submit">{busy ? 'Procesando…' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</button>
      </fieldset>
    </form>
  )
}

export default AuthForm
