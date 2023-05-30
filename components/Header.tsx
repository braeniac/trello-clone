"use client"; 
import Image from 'next/image'
import { UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'; 


function Header() {
  return (
    <header>
        <div className='flex flex-col md:flex-row p-5 items-center bg-gray-500/10 rounded-b-2xl'>
        <Image 
            src="https://links.papareact.com/c2cdd5"
            alt="trello logo"
            width={300}
            height={100}
            className='w-44 md:w-56 pb-10 md:pb-0 object-contain'
        />

        <div className='flex items-center space-x-5 flex-1 justify-end'>
            {/* search bar */}
            <form className='flex items-center space-x-5 p-2 bg-white rounded-md shadow-md flex-1 md:flex-initial'>
                <MagnifyingGlassIcon className='w-6 h-6 text-gray-400'/>
                <input 
                    type="text"
                    placeholder='Search'
                    className='flex-1 outline-none p-2'
                    />
                <button 
                    hidden 
                    type="submit"
                    >
                    Search
                </button>
            </form>


            <Avatar name="Maninder Singh" round color='#0055D1' size="50" />


        </div>
        </div>
            
    </header>

   
  )
}

export default Header