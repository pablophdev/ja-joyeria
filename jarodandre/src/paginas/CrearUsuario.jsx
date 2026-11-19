import { Link } from 'react-router-dom'
import { routes } from '../navigation/routes'
export default function CrearUsuario() {
  return <section className="container py-5"><h1>Registro no disponible</h1><p>La creación de cuentas está deshabilitada hasta configurar el proveedor de identidad. No se crean contraseñas ni cuentas locales.</p><Link to={routes.home}>Volver al inicio</Link></section>
}
