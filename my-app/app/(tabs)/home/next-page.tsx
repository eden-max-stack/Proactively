import { Stack } from "expo-router";
import { View, Text } from 'react-native'
import React from 'react'

const NextPage = () => {
  return (
    <View>
        <Stack.Screen options={{ headerShown: false }}/>
        <Text>NextPage</Text>
    </View>
  )
}

export default NextPage