import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const Button = ({title, type = 'primary'}) => {
  return (
    <View className={`px-2 py-3 content-center align-middle bg-${type} rounded-xl`}>
        <Text className='text-center text-white font-bold text-base'>
            {title}
        </Text>
    </View>
  )
}

export default Button