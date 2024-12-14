import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <section className='bg-white'>
        <div className='container mx-auto p-3 grid grid-cols-[250px,1fr] '>            
                {/* left part for the menu */}
                <div className='py-4 sticky top-24 overflow-y-auto hidden lg:block border-r'>
                    <UserMenu/>
                </div>

                {/* right part for the content */}
                <div className='bg-white min-h-[75vh]'>
                    <Outlet/>

                </div>
        </div>
    </section>
  )
}

export default Dashboard
