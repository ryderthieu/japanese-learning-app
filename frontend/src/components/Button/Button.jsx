import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Button = ({title, type = 'primary'}) => {
  return (
    <TouchableOpacity className={`px-2 py-3 bg-[]`}>
        <Text>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default Button