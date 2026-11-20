import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isAdmin, login, registerUser } from '../datos/auth'
import CamposUsuario from '../componentes/usuarios/CamposUsuario'
import { routes } from '../navigation/routes'

export default function Acceso({ mode = 'login' }) {
  const registering = mode === 'register'
  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    rut: '',
    phone: '',
    region: '',
    commune: '',
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
                />
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