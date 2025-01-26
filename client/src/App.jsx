import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fatchUserDetails from './utils/fatchUserDetails';
import { setUserDetails } from './store/userSlice'
import {setAllCategory} from './store/productSlice'
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';


function App() {
  const dispatch = useDispatch()


  const fatchUser = async () => {
    const userData = await fatchUserDetails()
    dispatch(setUserDetails(userData.data))

  }

  const fetchCategory = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.getCategory
        })
        const { data: responseData } = response
        if (responseData.success) {          
          dispatch(setAllCategory(responseData.data))
        }
      } catch (error) {
  
      } finally {
      }
    }
  

  useEffect(() => {
    fatchUser()
    fetchCategory()
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
