import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg';
import Svg, { Path } from 'react-native-svg';
import tw from 'twrnc'
import { generateQR } from '../services';

const Home = ({ setScreen }) => {
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(true);
    const [passKey, setPassKey] = useState('');
    const [error, setError] = useState('')

    useEffect(() => {
        generateCode();
    }, []);

    useEffect(() => {
        setTimeout(() => setValid(false), 10000);
    }, [passKey])

    const generateCode = async () => {
        setError('')
        setLoading(true)
        let res = await generateQR()
        if (res.success) {
            setPassKey(res.data);
            setLoading(false)
            setValid(true);
        }
        else {
            setError(res.message)
        }
    }

    const logout = async () => {
        const keys = ["app_token"];
        await AsyncStorage.multiRemove(keys);
        setScreen(0);
    }

    return (
        <>
            <View style={tw`flex-1 flex-col justify-between p-5`}>
                <TouchableOpacity onPress={logout} style={tw`flex-row items-center justify-center w-12 h-12 rounded-full bg-white ml-auto`}>
                    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={tw`w-7 h-7 text-red-600`}>
                        <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </Svg>
                </TouchableOpacity>

                <View style={tw`flex-col flex-grow items-center justify-center p-5`}>
                    {
                        loading ?
                            <ActivityIndicator size={50} />
                            :
                            <QRCode
                                size={300}
                                value={passKey}
                                // logo={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/640px-Instagram_icon.png' }}
                                // logoSize={75}
                                // logoBackgroundColor='transparent'
                            />
                    }
                    <Text style={tw`text-xl text-red-500 mt-6`}>{error ? error : valid ? '' : 'QR Code Expired'}</Text>
                </View>
                <TouchableOpacity onPress={generateCode} disabled={valid} style={tw`py-3 px-10 ${valid ? 'bg-gray-300' : 'bg-sky-400'} rounded-3xl w-full mx-auto`}>
                    <Text style={tw`text-white font-medium text-2xl text-center`}>Generate QR Code</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Home