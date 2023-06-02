import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import moment from 'moment/moment';

export default function Home() {
    const [data, setData] = useState('No result');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')
    const [employee, setEmployee] = useState()

    const fetchEmployeeDetails = async (token) => {
        setLoading(true)
        try {
            let res = await fetch(`https://cornerqube-backend-9imbl.ondigitalocean.app/api/work-wide/qr/verify`, { headers: { Authorization: `Bearer ${token}` } })
            res = await res.json();
            if (res.success) {
                setEmployee({ ...res.data, entryTime: new Date().toISOString() })
            }
            else {
                setError(res.message)
            }
        } catch (error) {
            setError('Something went wrong');
        }
        setLoading(false)
    }
    return (
        <>
            <main className="flex flex-grow items-center w-full bg-blue-100 py-5 px-10 2xl:px-20 gap-10">
                <div className='text-blue-900 flex-grow max-w-3xl'>
                    {
                        loading ?
                            <h1>Loading</h1> :
                            error ?
                                <h1>{error}</h1>
                                :
                                employee ?
                                    <div className='text-xl font-semibold gap-5 max-w-xl mx-auto bg-white p-8 rounded-lg shadow space-y-5'>
                                        <h1 className='col-span-2 text-center text-3xl font-medium mb-4 max-w-max pb-2 border-b-2 border-blue-900'>Employee Information</h1>
                                        <div className='flex items-center gap-2'>
                                            <span>Name:</span>
                                            <span className='font-normal tracking-wide'>{employee.name}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span>Employee Id:</span>
                                            <span className='font-normal tracking-wide'>{employee.employeeId}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span>Employee Email:</span>
                                            <span className='font-normal tracking-wide'>{employee.email}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span>Employee Contact:</span>
                                            <span className='font-normal tracking-wide'>{employee.phoneNumber}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span>Expiry Date:</span>
                                            <span className='font-normal tracking-wide'>{moment(employee.expiryDate).format('DD MMM YYYY')}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span>Employee DOB:</span>
                                            <span className='font-normal tracking-wide'>{moment(employee.dateOfBirth).format('DD MMM YYYY')}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span>Entry Time:</span>
                                            <span className='font-normal tracking-wide'>{moment(employee.entryTime).format('HH:MM , DD MMM YYYY')}</span>
                                        </div>
                                    </div>
                                    :
                                    <h1 className='text-center text-7xl font-medium text-blue-900  flex flex-col'><span className='text-2xl mb-3'>Welcome to</span><span>Work Wide</span></h1>
                    }
                </div>

                <div>
                    <div className='px-10 bg-white my-6 rounded-lg w-[500px] 2xl:w-[600px]'>
                        <h1 className='text-blue-900 text-3xl font-semibold text-center transform translate-y-8'>Show Your QR Code</h1>
                        <QrReader
                            onResult={(result, error) => {
                                if (!!result) {
                                    setData(result?.text);
                                    fetchEmployeeDetails(result?.text)
                                }
                            }}
                            style={{ width: '100%' }}
                        />
                    </div>

                </div>
            </main>
        </>
    )
}

export async function getServerSideProps() {
    return {
        props: {
            data: 'hello'
        }
    }
}
