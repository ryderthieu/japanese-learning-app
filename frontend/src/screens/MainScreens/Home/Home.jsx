import { Dimensions, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MyCarousel from './MyCarousel';

const Home = () => {
  return (
    <SafeAreaView>
      <Text>Home</Text>
      <MyCarousel />
    </SafeAreaView>
  )
}

export default Home

