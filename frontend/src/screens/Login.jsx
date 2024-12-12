import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input, Icon, Button, SocialIcon } from '@rneui/themed';

const Login = () => {
  return (
    <SafeAreaView>
      <View className='flex flex-col items-center w-screen h-screen px-10 py-16 bg-[#F3F6F8]'>
        <Image source={require('../assets/logo/logo-app.png')}></Image>
        <Text className='mt-10 mb-10 text-4xl font-bold text-[#2B308B]'>Đăng nhập</Text>
        <View className='flex flex-col gap-5'>
          <Input
            containerStyle={{width: 'full',height: 60,backgroundColor: 'white', borderRadius: 20}}
            placeholder='Email'
            leftIcon={{ type: 'ant-design', name: 'user'}}
          />
          <Input
            containerStyle={{width: 'full',height: 60,backgroundColor: 'white', borderRadius: 20}}
            placeholder='Mật khẩu'
            leftIcon={{ type: 'feather', name: 'key'}}
          />
          <Text className='text-right text-base text-[#2B308B]'>Quên mật khẩu?</Text>
          <Button 
            title={'Đăng nhập'}
            buttonStyle={{width: 350, height: 50, backgroundColor: '#F490AF', borderRadius: 20}}
          />
        </View>
        <Text className='mt-10 mb-5 text-base'>Hoặc đăng nhập bằng</Text>
        <View className='flex flex-row mb-5 '>
          <SocialIcon type='facebook' raise={false}/>
          <SocialIcon type='google' raise={false}/>
          <SocialIcon type='apple' light={true} raise={false}/>
        </View>
        <View className='flex flex-row gap-2 text-base'>
          <Text>Chưa có tài khoản?</Text>
          <Text className='text-[#2B308B] font-bold'>Đăng ký</Text>
        </View>

      </View>








    </SafeAreaView>
  )
}

export default Login
