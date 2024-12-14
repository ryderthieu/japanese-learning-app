import { Dimensions, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Carousel from 'react-native-reanimated-carousel';
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

