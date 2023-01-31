import Constants from 'expo-constants'
import { StyleSheet, View } from 'react-native'
import BiketripList from './BiketripList'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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
        <BiketripList />
      </SafeAreaProvider>
    </View>
  )
}

export default Main
