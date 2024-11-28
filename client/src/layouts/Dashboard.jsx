import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <section className='bg-white'>
        <div className='container mx-auto p-3 grid grid-cols-[250px,1fr] '>            
                {/* left part for the menu */}
                <div className='py-4 sticky top-24 overflow-y-auto hidden lg:block'>
                    <UserMenu/>
                </div>

                {/* right part for the content */}
                <div className='bg-white p-4'>
                    <Outlet/>

                </div>
        </div>
    </section>
  )
}

export default Dashboard
