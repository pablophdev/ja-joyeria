import { useParams } from 'react-router-dom'
import UserEditPage from '../pages/UserEditPage'

function UserEditRoute() {
  const { userId } = useParams()
  return <UserEditPage key={userId} userId={userId} />
}

export default UserEditRoute
