import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from '../components/layout/SiteLayout'
import HomePage from '../pages/HomePage'
import PendingPage from '../pages/PendingPage'
import NotFoundPage from '../pages/NotFoundPage'
import { pendingPages, routes } from './routes'

function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path={routes.home} element={<HomePage />} />
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
