import React, { useEffect, useState } from 'react'
import Splash from './screens/Splash'
import Security from './screens/Security';
import Login from './screens/Login';
import Home from './screens/Home';
import { getEmployee } from './services';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Routes() {

    const [loading, setLoading] = useState(true);
    const [screen, setScreen] = useState(0)

    useEffect(() => {
        setTimeout(() => validateUser(), 2000);
    }, [])

    const validateUser = async () => {
        let res = await getEmployee();
        if (res.success) {
            AsyncStorage.setItem('app_token', res.token)
            setScreen(2);
            setLoading(false);
        }
        else {
            setLoading(false)
        }
    }

    const Screen = [<Login setScreen={setScreen} />, <Security setScreen={setScreen} />, <Home setScreen={setScreen} />]

    return (
        <>
            {
                loading ?
                    <Splash />
                    :
                    Screen[screen]
            }
        </>
    )

}

export default Routes

