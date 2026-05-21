import Footer from '../common/Footer';
import Navbar from '../common/Navbar';
import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <>
      <Navbar />

      <main className='min-h-screen py-10'>
        <Outlet />
      </main>

      <Footer />

    </>


  )
}

export default PublicLayout
