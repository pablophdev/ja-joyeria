import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom'
import PlantillaSitio from '../componentes/estructura/PlantillaSitio'
import PlantillaAdmin from '../componentes/administracion/PlantillaAdmin'
import RutaAdmin from './RutaAdmin'
import { routes } from './routes'
import Inicio from '../paginas/Inicio'
import Tienda from '../paginas/Tienda'
import Nosotros from '../paginas/Nosotros'
import Contacto from '../paginas/Contacto'
import Blog from '../paginas/Blog'
import DetalleBlog from '../paginas/DetalleBlog'
import Carrito from '../paginas/Carrito'
import FinalizarCompra from '../paginas/FinalizarCompra'
import ResultadoPago from '../paginas/ResultadoPago'
import MisPedidos from '../paginas/MisPedidos'
import Acceso from '../paginas/Acceso'
import Usuarios from '../paginas/Usuarios'
import CrearUsuario from '../paginas/CrearUsuario'
import EditarUsuario from '../paginas/EditarUsuario'
import DetalleProducto from '../paginas/DetalleProducto'
import Administracion from '../paginas/Administracion'
import ProductosAdmin from '../paginas/ProductosAdmin'
import EditarProducto from '../paginas/EditarProducto'
import PedidosAdmin from '../paginas/PedidosAdmin'
import BoletaAdmin from '../paginas/BoletaAdmin'
import ReportesAdmin from '../paginas/ReportesAdmin'
import MensajesAdmin from '../paginas/MensajesAdmin'
import SuscriptoresAdmin from '../paginas/SuscriptoresAdmin'
import NoEncontrada from '../paginas/NoEncontrada'

function RutaProducto() {
  const { productId } = useParams()
  return <DetalleProducto key={productId} productId={productId} />
}

function RutaEditarProducto() {
  const { productId } = useParams()
  return <EditarProducto key={productId} productId={productId} />
}

function RutaEditarUsuario() {
  const { userId } = useParams()
  const { state } = useLocation()
  return <EditarUsuario key={userId} userId={userId} created={Boolean(state?.created)} />
}

function Rutas() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<PlantillaSitio />}>
          <Route path={routes.home} element={<Inicio />} />
          <Route path={routes.shop} element={<Tienda />} />
          <Route path={routes.about} element={<Nosotros />} />
          <Route path={routes.contact} element={<Contacto />} />
          <Route path={routes.blog} element={<Blog />} />
          <Route path={routes.blogDetails} element={<DetalleBlog />} />
          <Route path={routes.cart} element={<Carrito />} />
          <Route path={routes.checkout} element={<FinalizarCompra />} />
          <Route path={routes.paymentResult} element={<ResultadoPago />} />
          <Route path={routes.orders} element={<MisPedidos />} />
          <Route path={routes.login} element={<Acceso key="login" mode="login" />} />
          <Route path={routes.register} element={<Acceso key="register" mode="register" />} />
          <Route path={routes.users} element={<RutaAdmin><Usuarios /></RutaAdmin>} />
          <Route path={routes.userNew} element={<RutaAdmin><CrearUsuario /></RutaAdmin>} />
          <Route path={routes.userEdit} element={<RutaAdmin><RutaEditarUsuario /></RutaAdmin>} />
          <Route path={routes.productDetails} element={<RutaProducto />} />
          <Route path={routes.admin} element={<RutaAdmin><PlantillaAdmin /></RutaAdmin>}>
            <Route index element={<Administracion />} />
            <Route path={routes.adminOrders} element={<PedidosAdmin />} />
            <Route path={routes.adminReceipt} element={<BoletaAdmin />} />
            <Route path={routes.adminReports} element={<ReportesAdmin />} />
            <Route path={routes.adminMessages} element={<MensajesAdmin />} />
            <Route path={routes.adminSubscribers} element={<SuscriptoresAdmin />} />
            <Route path={routes.adminProducts} element={<ProductosAdmin />} />
            <Route path={routes.adminProductNew} element={<EditarProducto key="new" />} />
            <Route path={routes.adminProductEdit} element={<RutaEditarProducto />} />
          </Route>
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Rutas
