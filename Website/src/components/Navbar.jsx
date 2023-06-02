import React, { useEffect, useState } from 'react'
import Router from 'next/router'

function Navbar() {
    const [localStore, setLocalStore] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('app_token')) {
            setLocalStore(true)
        }
    }, [])

    return (
        <div className='flex items-center justify-between p-5 px-10 bg-white w-full'>
            <div>
                <h1 className='text-3xl font-bold text-blue-900 cursor-pointer'><span onClick={() => Router.push('/')}>Work Wide</span></h1>
            </div>
            <div className='flex items-center gap-6'>
                <button onClick={() => Router.push('/')} className='bg-blue-900 text-white text-lg hover:bg-blue-800 py-2 px-6 rounded-full'>Home</button>
                <button onClick={() => Router.push('/employees')} className='bg-blue-900 text-white text-lg hover:bg-blue-800 py-2 px-6 rounded-full'>Employees</button>
                {
                    typeof (window) !== undefined ?
                        localStore ?
                            <button onClick={() => Router.push('/login')} className='bg-rose-500 text-white text-lg hover:bg-rose-400 py-2 px-6 rounded-full'>Logout</button>
                            :
                            <button onClick={() => Router.push('/login')} className='bg-rose-500 text-white text-lg hover:bg-rose-400 py-2 px-6 rounded-full'>Login</button>

                        :
                        ''}
            </div>
        </div>
    )
}

export default Navbar