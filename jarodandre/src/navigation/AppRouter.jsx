import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from '../components/layout/SiteLayout'
import HomePage from '../pages/HomePage'
import ShopPage from '../pages/ShopPage'
import NotFoundPage from '../pages/NotFoundPage'
import { routes } from './routes'
import ProductDetailsRoute from './ProductDetailsRoute'
import CartPage from '../pages/CartPage'
import OrdersPage from '../pages/OrdersPage'
import AuthPage from '../pages/AuthPage'
import UsersPage from '../pages/UsersPage'
import UserEditRoute from './UserEditRoute'
import AdminRoute from './AdminRoute'
import AdminLayout from '../components/admin/AdminLayout'
import AdminPage from '../pages/AdminPage'
import AdminProductsPage from '../pages/AdminProductsPage'
import AdminProductEditorPage from '../pages/AdminProductEditorPage'
import AdminProductEditRoute from './AdminProductEditRoute'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import BlogPage from '../pages/BlogPage'
import BlogDetailsPage from '../pages/BlogDetailsPage'
import CheckoutPage from '../pages/CheckoutPage'
import PaymentResultPage from '../pages/PaymentResultPage'
import AdminOrdersPage from '../pages/AdminOrdersPage'
import AdminReceiptPage from '../pages/AdminReceiptPage'
import AdminReportsPage from '../pages/AdminReportsPage'

function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.shop} element={<ShopPage />} />
          <Route path={routes.about} element={<AboutPage />} />
          <Route path={routes.contact} element={<ContactPage />} />
          <Route path={routes.blog} element={<BlogPage />} />
          <Route path={routes.blogDetails} element={<BlogDetailsPage />} />
          <Route path={routes.cart} element={<CartPage />} />
          <Route path={routes.checkout} element={<CheckoutPage />} />
          <Route path={routes.paymentResult} element={<PaymentResultPage />} />
          <Route path={routes.orders} element={<OrdersPage />} />
          <Route path={routes.login} element={<AuthPage key="login" mode="login" />} />
          <Route path={routes.register} element={<AuthPage key="register" mode="register" />} />
          <Route path={routes.users} element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path={routes.userEdit} element={<AdminRoute><UserEditRoute /></AdminRoute>} />
          <Route path={routes.productDetails} element={<ProductDetailsRoute />} />
          <Route path={routes.admin} element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminPage />} />
            <Route path={routes.adminOrders} element={<AdminOrdersPage />} />
            <Route path={routes.adminReceipt} element={<AdminReceiptPage />} />
            <Route path={routes.adminReports} element={<AdminReportsPage />} />
            <Route path={routes.adminProducts} element={<AdminProductsPage />} />
            <Route path={routes.adminProductNew} element={<AdminProductEditorPage key="new" />} />
            <Route path={routes.adminProductEdit} element={<AdminProductEditRoute />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
