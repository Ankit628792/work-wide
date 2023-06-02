import React from 'react'

const PageLoader = () => {
    return (
        <section className='flex-grow bg-white w-full grid place-items-center'>
            <img src="/loading.svg" className='w-full h-full max-w-xl' alt="" />
        </section>
    )
}

export default PageLoader