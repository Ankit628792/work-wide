import React, { useState } from 'react'
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import tw from 'twrnc'
import { postEmployee } from '../services'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Security = ({ setScreen }) => {
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const verify = async () => {
        let idNumber = id.replace(/[^0-9A-Z]/g, "")
        if (idNumber.length == 6 && password?.length > 5) {
            setLoading(true);
            let res = await postEmployee({ employeeId: idNumber, password: password, type: 'verifyCredentials' })
            if (res.success) {
                AsyncStorage.setItem('app_token', res.token)
                setScreen(2);
                setLoading(false)
            }
            else {
                setError(res.message)
                setLoading(false)
            }
        }
        else {
            setError('Invalid credentials')
        }
    }

    return (
        <>
            <View style={tw`flex-1 flex-col p-5`}>
                {
                    loading ?
                        <View style={tw`flex-1 flex-col items-center justify-center`}>
                            <ActivityIndicator size={60} />
                        </View>
                        :

                        <>
                            <TouchableOpacity onPress={() => setScreen(0)} style={tw`flex-row items-center justify-center w-12 h-12 rounded-full bg-white mr-auto`}>
                                <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={tw`w-7 h-7 text-gray-600`}>
                                    <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </Svg>
                            </TouchableOpacity>
                            <Text style={tw`text-2xl text-gray-700 text-center`}>Two Factor Authentication</Text>
                            <Image
                                style={tw`w-full max-h-56 my-4`}
                                resizeMode='contain'
                                source={require('../assets/images/security.png')}
                            />
                            <View style={tw`w-full max-w-[300px] mx-auto`}>
                                <Text style={tw`text-xl text-gray-400 mb-1`}>Employee id</Text>
                                <TextInput value={id} maxLength={6} onChangeText={(txt) => { setId(txt); setError('') }} style={tw`border border-gray-300 text-gray-600 font-medium px-4 text-xl rounded-xl tracking-wider`} />
                            </View>
                            <View style={tw`w-full max-w-[300px] mx-auto mt-3`}>
                                <Text style={tw`text-xl text-gray-400 mb-1`}>Password</Text>
                                <TextInput secureTextEntry={true} value={password} onChangeText={(txt) => { setPassword(txt); setError('') }} style={tw`border border-gray-300 text-gray-600 font-medium px-4 text-xl rounded-xl tracking-wider`} />
                            </View>
                            <Text style={tw`text-base text-red-500 mt-2 w-full max-w-[300px] mx-auto `}>{error || ''}</Text>

                            <TouchableOpacity disabled={id.length != 6 && password?.length < 6} onPress={verify} style={tw`py-3 mt-6 px-10 ${id.length != 6 && password?.length < 6 ? 'bg-gray-300' : 'bg-sky-400'} rounded-3xl w-full max-w-[200px] mx-auto`}>
                                <Text style={tw`text-white font-medium text-2xl text-center`}>Verify</Text>
                            </TouchableOpacity>
                        </>
                }
            </View>
        </>
    )
}

export default Security