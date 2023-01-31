import Constants from 'expo-constants'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Route, Routes, Navigate } from 'react-router-native'
import BiketripList from './BiketripList'
import TopBar from './TopBar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1
  }
})

const Main = () => {
  const [searchVisible, setSearchVisible] = useState(false)

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <Provider>
          <TopBar searchVisible={searchVisible} setSearchVisible={setSearchVisible}/>
          <Routes>
            <Route path="/" element={<BiketripList searchVisible={searchVisible}/>} exact />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Provider>
      </SafeAreaProvider>
    </View>
  )
}

export default Main
