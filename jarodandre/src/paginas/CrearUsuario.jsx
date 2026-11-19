import { Link } from 'react-router-dom'
import { routes } from '../navigation/routes'
export default function CrearUsuario() {
  return <section className="container py-5"><h1>Registro de usuarios</h1><p>Las cuentas se crean mediante el registro seguro de Cognito. El usuario debe iniciar sesión y completar su perfil. Después puedes asignar su rol y estado desde la gestión de usuarios.</p><p>La API no permite crear ni eliminar identidades desde este panel. Para impedir el acceso de una cuenta, cambia su estado a Bloqueado.</p><Link to={routes.users}>Volver a usuarios</Link></section>
}
