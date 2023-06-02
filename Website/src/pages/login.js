import Router from 'next/router';
import React, { useEffect, useState } from 'react'

const login = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const handleChange = (e) => {
        e.preventDefault();
        setError('')
        setData({ ...data, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        localStorage.setItem('app_token', '')
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.email && data.password) {
            if (password?.toString().length > 6) {
                setLoading(true)
                try {
                    let res = await fetch(`https://cornerqube-backend-9imbl.ondigitalocean.app/api/work-wide/adminLogin`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
                    res = await res.json();
                    if (res?.success) {
                        localStorage.setItem('app_token', res.token)
                        Router.push('/employees')
                    }
                    else {
                        setError(res?.message)
                    }
                } catch (error) {
                    setError('Something went wrong')
                }
                setLoading(false)
            }
            else {
                setError('Invalid Password')
            }
        }
        else {
            setError("Fill All details")
        }
    }
    return (
        <section className='bg-blue-100 flex-grow flex flex-col items-center justify-center'>
            <form onSubmit={handleSubmit} className='bg-white text-blue-900 p-10 rounded-lg shadow-md w-full max-w-2xl min-h-[500px] flex flex-col items-center'>
                <h1 className='text-xl font-medium text-center'>Login To</h1>
                <h1 className='text-5xl font-medium text-center'>Work Wide</h1>

                <div className='w-full max-w-sm mt-10'>
                    <p className='text-lg font-medium mb-1'>Email Id</p>
                    <input value={data.email} onChange={handleChange} type="email" name="email" id="email" placeholder='Enter Admin Email' className='border p-2 px-4 rounded-lg w-full max-w-sm bg-white shadow outline-none' />
                </div>
                <div className='my-6 w-full max-w-sm'>
                    <p className='text-lg font-medium mb-1'>Password</p>
                    <input value={data.password} onChange={handleChange} type="password" name="password" id="password" placeholder='Enter Admin password' className='border p-2 px-4 rounded-lg w-full max-w-sm bg-white shadow outline-none' />
                </div>
                <p className='text-red-500'>{error || ''}</p>

                <button disabled={loading} type='submit' className='bg-blue-900 disabled:bg-gray-400 text-white py-2 px-6 mt-4 rounded-lg text-lg outline-none'>Submit</button>

            </form>
        </section>
    )
}

export default login