import { useParams } from 'react-router-dom'
import AdminProductEditorPage from '../pages/AdminProductEditorPage'

function AdminProductEditRoute() {
  const { productId } = useParams()
  return <AdminProductEditorPage key={productId} productId={productId} />
}

export default AdminProductEditRoute
