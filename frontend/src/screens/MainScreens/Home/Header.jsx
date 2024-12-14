import { Dimensions, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MyCarousel from './MyCarousel';

const Header = () => {
  return (
      <View className='flex-1 flex-col bg-gray-100 border-2 border-red-600'>
        <Text>Header</Text>
      </View>
    
  )
}

export default Header

