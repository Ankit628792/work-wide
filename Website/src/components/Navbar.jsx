import React from 'react'
import Router from 'next/router'

function Navbar() {
    return (
        <div className='flex items-center justify-between p-5 bg-white w-full'>
            <div>
                <h1 className='text-3xl font-bold text-blue-900 cursor-pointer'><span onClick={() => Router.push('/')}>Work Wide</span></h1>
            </div>
            <div className='flex items-center gap-6'>
                <button onClick={() => Router.push('/')} className='bg-blue-900 text-white text-lg hover:bg-blue-800 py-2 px-6 rounded-full'>Home</button>
                <button onClick={() => Router.push('/employees')} className='bg-blue-900 text-white text-lg hover:bg-blue-800 py-2 px-6 rounded-full'>Employees</button>
            </div>
        </div>
    )
}

export default Navbar