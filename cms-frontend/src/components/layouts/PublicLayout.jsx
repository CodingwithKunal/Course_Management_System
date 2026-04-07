
import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <div>
      <h2>Navbar</h2>
        <Outlet />
      <h3>Footer</h3>
    </div>
  )
}

export default PublicLayout
