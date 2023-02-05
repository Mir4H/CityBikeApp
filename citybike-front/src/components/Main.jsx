import Constants from 'expo-constants'
import { StyleSheet, View } from 'react-native'
import { Route, Routes, Navigate } from 'react-router-native'
import BiketripList from './BiketripList'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-native-paper'
import BiketripDetails from './BiketripDetails'
import StationList from './StationList'
import StationDetails from './StationDetails'

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
            <Route path="/" element={<BiketripList title='Biketrips'/>} exact />
            <Route path="/:id" element={<BiketripDetails title='Details'/>} />
            <Route path="/bikestations" element={<StationList title='Stations'/>} exact />
            <Route path="/stations/:id" element={<StationDetails title='StationDetails'/>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Provider>
      </SafeAreaProvider>
    </View>
  )
}

export default Main
