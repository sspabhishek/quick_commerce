import React from 'react'
import UserMenu from '../components/UserMenu'
import { IoClose } from "react-icons/io5";

const UserMenuMobile = () => {
  return (
    <div>
      <section className='bg-white h-full w-full py-2 lg:hidden'>
        <button onClick={()=> window.history.back()} className='text-neutral-800 block w-fit ml-auto'>
          <IoClose size={20}/>
        </button>
        <div className='container mx-auto px-3 pb-8'>
          <UserMenu />
        </div>
      </section>
    </div>
  )
}

export default UserMenuMobile
