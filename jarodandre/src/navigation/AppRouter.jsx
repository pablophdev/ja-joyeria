import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from '../components/layout/SiteLayout'
import HomePage from '../pages/HomePage'
import ShopPage from '../pages/ShopPage'
import PendingPage from '../pages/PendingPage'
import NotFoundPage from '../pages/NotFoundPage'
import { pendingPages, routes } from './routes'
import ProductDetailsRoute from './ProductDetailsRoute'
import CartPage from '../pages/CartPage'

function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.shop} element={<ShopPage />} />
          <Route path={routes.cart} element={<CartPage />} />
          <Route path={routes.productDetails} element={<ProductDetailsRoute />} />
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
