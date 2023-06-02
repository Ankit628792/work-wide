import React from 'react'
import { Image, Text, View } from 'react-native'
import tw from 'twrnc'

const Splash = () => {
    return (
        <>
            <View style={tw`flex-1 flex-col items-center justify-center p-5`}>
                <Image
                    style={tw`w-full h-80`}
                    source={require('../assets/images/loading.png')}
                />
                <Text style={tw`text-3xl font-medium text-gray-800 mt-10`}>Loading...</Text>
            </View>
        </>
    )
}

export default Splash