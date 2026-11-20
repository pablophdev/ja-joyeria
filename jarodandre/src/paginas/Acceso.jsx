import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUser, isAdmin, login, registerUser } from '../datos/auth'
import CamposUsuario from '../componentes/usuarios/CamposUsuario'
import { userRoles, userStatuses } from '../datos/userOptions'
import { getUserEditPath, routes } from '../navigation/routes'

export default function Acceso({ mode = 'login' }) {
  const creating = mode === 'admin-create'
  const registering = mode === 'register' || creating
  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    rut: '',
    phone: '',
    region: '',
    commune: '', role: 'user', status: 'active',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function change(event) {
    const { name, value } = event.target
    setValues((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'region' ? { commune: '' } : {}),
    }))
    setError('')
  }

  async function submit(event) {
    event.preventDefault()
    if (busy) return

    if (registering && values.password !== values.confirmPassword) {
      setError('Las contraseñas deben coincidir.')
      return
    }

    setBusy(true)
    setError('')

    try {
      if (creating) {
        const user = await createUser(values)
        window.location.assign(getUserEditPath(user.id))
        return
      }
      const user = registering
        ? await registerUser(values)
        : await login(values.email, values.password)

      window.location.assign(isAdmin(user) ? routes.admin : routes.home)
    } catch (failure) {
      setError(failure.message)
      setBusy(false)
    }
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <h1>{registering ? 'Crear cuenta' : 'Iniciar sesión'}</h1>

          {error && <p className="alert alert-danger" role="alert">{error}</p>}

          <form onSubmit={submit}>
            <fieldset disabled={busy}>
              {registering && (
                <CamposUsuario values={values} onChange={change} />
              )}

              {creating && <div className="row mb-3">
                {[{ name: 'role', label: 'Rol', options: userRoles }, { name: 'status', label: 'Estado', options: userStatuses }].map((field) => (
                  <div className="col-sm-6" key={field.name}><label className="form-label" htmlFor={field.name}>{field.label}</label>
                    <select className="form-select" id={field.name} name={field.name} value={values[field.name]} onChange={change}>
                      {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select></div>))}
              </div>}
              <div className="mb-3">
                <label className="form-label" htmlFor="access-email">Correo</label>
                <input
                  className="form-control"
                  id="access-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={values.email}
                  onChange={change}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="access-password">
                  Contraseña
                </label>
                <input
                  className="form-control"
                  id="access-password"
                  name="password"
                  type="password"
                  autoComplete={registering ? 'new-password' : 'current-password'}
                  minLength={registering ? 8 : undefined}
                  maxLength={72}
                  value={values.password}
                  onChange={change}
                  required
                  aria-describedby={registering ? 'access-password-help' : undefined}
                />
                {registering && <p className="form-text" id="access-password-help">Usa entre 8 y 72 caracteres.</p>}
              </div>

              {registering && (
                <div className="mb-3">
                  <label className="form-label" htmlFor="access-confirm">
                    Confirmar contraseña
                  </label>
                  <input
                    className="form-control"
                    id="access-confirm"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    maxLength={72}
                    value={values.confirmPassword}
                    onChange={change}
                    required
                  />
                </div>
              )}

              <button className="btn btn-dark" type="submit">
                {busy ? 'Procesando…' : registering ? 'Crear cuenta' : 'Ingresar'}
              </button>
            </fieldset>
          </form>

          <p className="mt-4">
            <Link to={registering ? routes.login : routes.register}>
              {registering ? 'Ya tengo una cuenta' : 'Crear una cuenta'}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}