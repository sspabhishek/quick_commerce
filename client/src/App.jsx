import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fatchUserDetails from './utils/fatchUserDetails';
import { setUserDetails } from './store/userSlice'
import { useDispatch } from 'react-redux';


function App() {
  const dispatch = useDispatch()


  const fatchUser = async () => {
    const userData = await fatchUserDetails()
    dispatch(setUserDetails(userData.data))

  }

  useEffect(() => {
    fatchUser()
  }, [])

  return (
    <>
      <Header />
      <main className='min-h-[75vh]'>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  )
}

export default App
