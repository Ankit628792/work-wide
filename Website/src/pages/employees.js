import moment from 'moment';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import PageLoader from '../components/PageLoader';

const employees = () => {
    const [pageLoading, setPageLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([])
    const [disabled, setDisable] = useState(false);
    const [edit, setEdit] = useState(null)
    const [search, setSearch] = useState('')

    const checkUser = async () => {
        let res = await fetch(`https://cornerqube-backend-9imbl.ondigitalocean.app/api/work-wide/auth`, { headers: { Authorization: `Bearer ${localStorage?.getItem('app_token') || ''}` } }).then(res => res.json())
        if (res.success) {
            localStorage.setItem('app_token', res.token);
            setTimeout(() => setPageLoading(false), 1500);
            getEmployees();
        }
        else {
            Router.push('/login')
        }
    }

    useEffect(() => { checkUser() }, [])

    const getEmployees = async () => {
        setLoading(true)
        try {
            let res = await fetch(`https://cornerqube-backend-9imbl.ondigitalocean.app/api/work-wide/employee`, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('app_token')}` } })
            res = await res.json();
            if (res?.success) {
                setData(res.data)
            }
            else {
                setError(res?.message)
            }
        } catch (error) {
            setError('Something went wrong')
        }
        setLoading(false)
    }

    const delEmployee = async (id) => {
        setDisable(true)
        try {
            let res = await fetch(`https://cornerqube-backend-9imbl.ondigitalocean.app/api/work-wide/employee?id=${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('app_token')}` } })
            res = await res.json();
            if (res?.success) {
                let idx = data.findIndex(item => item.id == id)
                if (idx > -1) {
                    let arr = [...data];
                    arr.splice(idx, 1)
                    setData(arr)
                }
            }
            else {
                alert(res?.message)
            }
        } catch (error) {
            alert('Something went wrong')
        }
        setDisable(false)
    }

    const validateFilter = (item) => {
        let searchFilter = item?.name?.toLowerCase()?.includes(search?.toLowerCase()) || item?.employeeId?.toLowerCase()?.includes(search?.toLowerCase()) || item?.email?.toLowerCase()?.includes(search?.toLowerCase()) || item?.phoneNumber?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
        return searchFilter
    }

    if (pageLoading) return <PageLoader />

    return (
        <>
            <section className='bg-blue-100 w-full flex-grow p-5 px-10'>
                <div className='flex items-center gap-6 p-5 sticky top-0'>
                    <div className='flex items-center bg-white rounded shadow gap-1 w-full max-w-lg py-1 px-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search by Name, Employee Id, Phone Number or Email' className='p-1 flex-grow outline-none text-blue-900' />
                    </div>
                    <div>
                        <button className='bg-blue-900 text-white py-2 px-6 rounded-lg text-lg' onClick={() => setEdit(true)}>Add Employee</button>
                    </div>
                </div>

                <div className='bg-white p-4 rounded-lg min-h-[60dvh] relative'>
                    {
                        loading ?
                            <h1 className='text-3xl text-gray-300 text-center font-medium w-full absolute top-28 left-0 right-0'>Loading...</h1>
                            :
                            error ?
                                <h1 className='text-3xl text-gray-300 text-center font-medium w-full absolute top-28 left-0 right-0'>{error}</h1>
                                :
                                data.filter(item => validateFilter(item))?.length ? <></>
                                    :
                                    <h1 className='text-3xl text-gray-300 text-center font-medium w-full absolute top-28 left-0 right-0'>No Employee Found</h1>
                    }
                    <table className='w-full table-auto'>
                        <thead className='text-gray-500 font-medium border-b'>
                            <tr>
                                <td className='p-2'>Sno</td>
                                <td className='p-2'>Employee Id</td>
                                <td className='p-2'>Name</td>
                                <td className='p-2'>Email</td>
                                <td className='p-2'>Mobile Number</td>
                                <td className='p-2'>DOB</td>
                                <td className='p-2'>Expiry Date</td>
                                <td className='p-2'>Password</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody className='text-gray-800'>
                            {
                                data.filter(item => validateFilter(item))?.map((item, i) => <Row key={i} i={i} item={item} setEdit={setEdit} delEmployee={delEmployee} />)
                            }
                        </tbody>
                    </table>
                </div>
            </section>
            {edit && <AddEmployee initialData={edit} getEmployees={getEmployees} setEdit={setEdit} disabled={disabled} />}
        </>
    )
}

export default employees

const Row = ({ i, item, setEdit, delEmployee, disabled }) => {
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState('')
    const [load, setLoad] = useState(false)

    useEffect(() => {
        setPassword(item?.password)
    }, [item.password])

    const updatePassword = async () => {
        setLoad(true)
        try {
            let res = await fetch(`https://cornerqube-backend-9imbl.ondigitalocean.app/api/work-wide/employee/updatePassword`, { method: 'PATCH', body: JSON.stringify({ id: item?.id, employeeId: item?.employeeId }), headers: { 'Content-Type': 'application/json' } })
            res = await res.json();
            if (res?.success) {
                setPassword(res.data.password)
            }
            else {
                setError(res?.message)
            }
        } catch (error) {
            alert('Something went wrong')
        }
        setLoad(false)
    }

    return (
        <tr className='border-b last:border-b-0'>
            <td className='p-2'>{i + 1}</td>
            <td className='p-2'>{item?.employeeId}</td>
            <td className='p-2'>{item?.name}</td>
            <td className='p-2'>{item?.email}</td>
            <td className='p-2'>{item?.phoneNumber}</td>
            <td className='p-2'>{moment(item?.dateOfBirth).format('DD MMM YYYY')}</td>
            <td className='p-2'>{moment(item?.expiryDate).format('DD MMM YYYY')}</td>
            <td className='p-2'>
                <div className='flex items-center gap-1'>
                    <input key={item.id} type={show ? 'text' : 'password'} value={password} readOnly className='cursor-pointer w-[100px] text-sm outline-none border rounded-md p-1' onClick={() => { window.navigator.clipboard.writeText(item?.password); alert('Password copied to clipboard') }} />
                    <svg onClick={() => setShow(!show)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-sky-500 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <button disabled={load} className='text-orange-500 disabled:text-gray-500' onClick={() => updatePassword()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transform active:rotate-180 duration-1000">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>
            </td>
            <td>
                <button className='text-sky-500 disabled:text-gray-500' onClick={() => setEdit(item)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                </button>
            </td>
            <td>
                <button disabled={disabled} className='text-red-500 disabled:text-gray-500' onClick={() => delEmployee(item.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </td>
        </tr>
    )
}

const AddEmployee = ({ initialData, getEmployees, setEdit }) => {
    const [data, setData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        employeeId: initialData?.employeeId || '',
        phoneNumber: initialData?.phoneNumber || '',
        dateOfBirth: initialData?.dateOfBirth ? moment(initialData?.dateOfBirth).format('YYYY-MM-DD') : '',
        expiryDate: initialData?.expiryDate ? moment(initialData?.expiryDate).format('YYYY-MM-DD') : '',
    })
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        e.preventDefault();
        setError('')
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data?.employeeId?.length == 6) {
            setLoading(true)
            try {
                let res = await fetch(`https://cornerqube-backend-9imbl.ondigitalocean.app/api/work-wide/employee`, { method: initialData?.id ? 'PATCH' : 'POST', body: JSON.stringify(initialData?.id ? { ...data, id: initialData?.id } : data), headers: { 'Content-Type': 'application/json' } })
                res = await res.json();
                if (res?.success) {
                    getEmployees();
                    setEdit(null);
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
            setError('Invalid Employee Id')
        }
    }

    return (
        <div className='fixed inset-0 bg-transparent z-50 grid place-items-center'>
            <div className='fixed inset-0 bg-black bg-opacity-50 z-10 cursor-pointer' onClick={() => setEdit(null)}>
            </div>
            <form onSubmit={handleSubmit} className='bg-white p-10 z-20 rounded text-blue-900 w-full max-w-3xl flex flex-col items-center gap-2 relative'>
                <button className='text-gray-500 absolute top-5 right-5' onClick={() => setEdit(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className='text-4xl font-medium text-center'>{initialData?.id ? 'Edit' : 'Add'} Employee</h1>

                <div className='w-full max-w-md'>
                    <p className='text-lg font-medium mb-1'>Name</p>
                    <input required value={data.name} onChange={handleChange} type="text" name="name" id="name" placeholder='Enter Employee Name' className='border p-2 px-4 rounded-lg w-full max-w-md bg-white shadow outline-none' />
                </div>
                <div className='w-full max-w-md'>
                    <p className='text-lg font-medium mb-1'>Employee Id</p>
                    <input required value={data.employeeId} onChange={handleChange} type="text" name="employeeId" id="employeeId" placeholder='Enter Employee Id' className='border p-2 px-4 rounded-lg w-full max-w-md bg-white shadow outline-none' />
                </div>
                <div className='w-full max-w-md'>
                    <p className='text-lg font-medium mb-1'>Email Id</p>
                    <input required value={data.email} onChange={handleChange} type="email" name="email" id="email" placeholder='Enter Employee Email' className='border p-2 px-4 rounded-lg w-full max-w-md bg-white shadow outline-none' />
                </div>
                <div className='w-full max-w-md'>
                    <p className='text-lg font-medium mb-1'>Mobile Number</p>
                    <input required value={data.phoneNumber} onChange={handleChange} type="text" name="phoneNumber" id="phoneNumber" placeholder='Enter Employee Mobile Number' className='border p-2 px-4 rounded-lg w-full max-w-md bg-white shadow outline-none' />
                </div>
                <div className='w-full max-w-md'>
                    <p className='text-lg font-medium mb-1'>Date Of Birth</p>
                    <input required value={data.dateOfBirth} onChange={handleChange} type="date" name="dateOfBirth" id="dateOfBirth" placeholder='Enter Employee DOB' className='border p-2 px-4 rounded-lg w-full max-w-md bg-white shadow outline-none' />
                </div>
                <div className='w-full max-w-md'>
                    <p className='text-lg font-medium mb-1'>Expiry Date</p>
                    <input required value={data.expiryDate} onChange={handleChange} type="date" name="expiryDate" id="expiryDate" placeholder='Enter Employee Expiry Date' className='border p-2 px-4 rounded-lg w-full max-w-md bg-white shadow outline-none' />
                </div>
                <p className='text-red-500'>{error || ''}</p>

                <button disabled={loading} type='submit' className='bg-blue-900 disabled:bg-gray-400 text-white py-2 px-6 mt-4 rounded-lg text-lg outline-none'>Submit</button>
            </form>
        </div>
    )
}