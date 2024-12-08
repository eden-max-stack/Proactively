import { Link, Stack } from "expo-router";
import { View, Text } from 'react-native';
import React from 'react';

const index = () => {
  return (
    <View>
        <Stack.Screen options={{ headerShown: false }} />
        <Text>index</Text>
        <Link href={"/home/next-page"} style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Go to next page</Text>
        </Link>
    </View>
  )
}

export default index