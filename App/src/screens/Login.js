import React, { useState } from 'react'
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import tw from 'twrnc'
import { postEmployee } from '../services'

const Login = ({ setScreen }) => {
  const [isOtp, setIsOtp] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const generateOtp = async () => {
    setLoading(true)
    let number = phoneNumber.replace(/[^0-9]/g, "")
    if (number.length == 10) {
      let res = await postEmployee({ phoneNumber: number, type: 'generateOtp' })
      if (res.success) {
        setIsOtp(res.data.otp)
        setLoading(false)
      }
      else {
        setError(res.message)
        setLoading(false)
      }
    }
    else {
      setError('Invalid Mobile Number')
    }
  }

  const verifyOtp = async () => {
    if (isOtp?.toString()?.length == 5) {
      let data = {
        phoneNumber: phoneNumber,
        otp: isOtp,
        type: 'verifyOtp'
      }
      setLoading(true)
      let res = await postEmployee(data)
      if (res.success) {
        setScreen(1)
        setLoading(false)
      }
      else {
        setError(res.message)
        setLoading(false)
      }
    }
    else {
      setError('Invalid OTP')
    }
  }

  return (
    <>
      <View style={tw`flex-1 flex-col items-center justify-center p-5`}>
        {
          loading ?
            <ActivityIndicator size={60} />
            :
            <>
              {isOtp ? <TouchableOpacity onPress={() => setIsOtp(false)} style={tw`flex-row items-center justify-center w-12 h-12 rounded-full bg-white mr-auto`}>
                <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={tw`w-7 h-7 text-gray-600`}>
                  <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </Svg>
              </TouchableOpacity> : <View style={tw`w-12 h-12`}></View>}
              <Image
                style={tw`w-full h-80`}
                resizeMode='contain'
                source={isOtp ? require('../assets/images/otp.png') : require('../assets/images/login.png')}
              />
              {
                isOtp ?
                  <>
                    <View style={tw`w-full flex-col items-center py-8`}>
                      <Text style={tw`text-2xl text-gray-400`}>Enter OTP</Text>
                      <View style={tw`flex-row items-center justify-center mt-4`}>
                        {
                          isOtp?.toString()?.split("")?.map((item, i) => (
                            <Text key={i} style={tw`text-gray-600 border border-gray-200 px-4 py-2 mx-1 rounded-lg text-2xl font-medium`}>{item}</Text>
                          ))
                        }
                      </View>
                      <Text style={tw`text-base text-red-500 mt-2`}>{error || ''}</Text>
                    </View>
                    <TouchableOpacity disabled={isOtp?.toString()?.length != 5} style={tw`py-3 px-10 ${isOtp?.toString()?.length != 5 ? 'bg-gray-300' : 'bg-sky-400'} rounded-3xl`} onPress={verifyOtp}>
                      <Text style={tw`text-white font-medium text-2xl`}>Verify OTP</Text>
                    </TouchableOpacity>
                  </>
                  :
                  <>
                    <View style={tw`w-full flex-col items-center py-8`}>
                      <Text style={tw`text-2xl text-gray-400`}>Enter Mobile Number</Text>
                      <TextInput keyboardType='number-pad' maxLength={10} value={phoneNumber} onChangeText={(txt) => { setPhoneNumber(txt); setError('') }} placeholder='9818451195' style={tw`border-b border-gray-300 w-full max-w-xs text-center text-gray-600 font-medium text-4xl tracking-wide`} />
                      <Text style={tw`text-base text-red-500 mt-2`}>{error || ''}</Text>
                    </View>
                    <TouchableOpacity disabled={phoneNumber?.length != 10} style={tw`py-3 px-10 ${phoneNumber?.length != 10 ? 'bg-gray-300' : 'bg-sky-400'} rounded-3xl`} onPress={generateOtp}>
                      <Text style={tw`text-white font-medium text-2xl`}>Send OTP</Text>
                    </TouchableOpacity>
                  </>
              }
            </>
        }
      </View>
    </>
  )
}

export default Login