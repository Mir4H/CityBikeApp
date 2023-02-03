import Constants from 'expo-constants'
import { StyleSheet, View } from 'react-native'
import { Route, Routes, Navigate } from 'react-router-native'
import BiketripList from './BiketripList'
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

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <Provider>
          <Routes>
            <Route path="/" element={<BiketripList/>} exact />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Provider>
      </SafeAreaProvider>
    </View>
  )
}

export default Main
