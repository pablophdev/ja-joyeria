import { useLocation, useParams } from 'react-router-dom'
import UserEditPage from '../pages/UserEditPage'

function UserEditRoute() {
  const { userId } = useParams()
  const { state } = useLocation()
  return <UserEditPage key={userId} userId={userId} created={Boolean(state?.created)} />
}

export default UserEditRoute
