import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from '../components/layout/SiteLayout'
import HomePage from '../pages/HomePage'
import ShopPage from '../pages/ShopPage'
import PendingPage from '../pages/PendingPage'
import NotFoundPage from '../pages/NotFoundPage'
import { pendingPages, routes } from './routes'
import ProductDetailsRoute from './ProductDetailsRoute'
import CartPage from '../pages/CartPage'
import OrdersPage from '../pages/OrdersPage'
import AuthPage from '../pages/AuthPage'
import UsersPage from '../pages/UsersPage'
import UserEditRoute from './UserEditRoute'
import AdminLayout from '../components/admin/AdminLayout'
import AdminPage from '../pages/AdminPage'
import AdminProductsPage from '../pages/AdminProductsPage'
import AdminProductEditorPage from '../pages/AdminProductEditorPage'
import AdminProductEditRoute from './AdminProductEditRoute'

function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.shop} element={<ShopPage />} />
          <Route path={routes.cart} element={<CartPage />} />
          <Route path={routes.orders} element={<OrdersPage />} />
          <Route path={routes.login} element={<AuthPage key="login" mode="login" />} />
          <Route path={routes.register} element={<AuthPage key="register" mode="register" />} />
          <Route path={routes.users} element={<UsersPage />} />
          <Route path={routes.userEdit} element={<UserEditRoute />} />
          <Route path={routes.productDetails} element={<ProductDetailsRoute />} />
          <Route path={routes.admin} element={<AdminLayout />}>
            <Route index element={<AdminPage />} />
            <Route path={routes.adminProducts} element={<AdminProductsPage />} />
            <Route path={routes.adminProductNew} element={<AdminProductEditorPage key="new" />} />
            <Route path={routes.adminProductEdit} element={<AdminProductEditRoute />} />
          </Route>
          {pendingPages.map(({ path, title }) => (
            <Route key={path} path={path} element={<PendingPage title={title} />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
