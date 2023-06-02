import '../app/globals.css'
import Navbar from '../components/Navbar'
import Head from 'next/head'


function MyApp({ Component, pageProps }) {
    return (<>
        <Head>
            <title>Work Wide App</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel='icon' href='/logo.png' />
        </Head>
        <div className='flex min-h-[100dvh] flex-col'>
            <Navbar />
            <Component {...pageProps} />
        </div>
    </>)
}

export default MyApp