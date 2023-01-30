import { useState, useEffect } from 'react'
import { FlatList, View, StyleSheet, Text } from 'react-native'

const styles = StyleSheet.create({
  separator: {
    height: 5,
    width: '100%'
  }
})

const ItemSeparator = () => <View style={styles.separator} />

const BiketripList = () => {
  const [biketripData, setBiketripData] = useState()

  const fetchBiketrips = async () => {
    const response = await fetch('http://192.168.1.130:3001/api/biketrips')
    const json = await response.json()

    setBiketripData(json)
  }

  useEffect(() => {
    fetchBiketrips()
  }, [])

  const biketrips = biketripData ? biketripData.biketrips : []

  const distance = (meters) => {
    const km = `${(meters / 1000).toFixed(2)} km`
    return km
  }

  const time = (seconds) => {
    const getMinutes = Math.floor(seconds / 60)
    const getSeconds = seconds - getMinutes * 60
    const minutes = `${getMinutes} minutes and ${getSeconds} seconds`
    return minutes
  }

  const averageSpeed = (meters, seconds) => {
    const speed = (meters / seconds) * 3.6
    return speed.toFixed(2)
  }

  return (
    <View>
      <FlatList
        data={biketrips}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>
                {`Biketrip: ${item.departureStationName} - ${
                  item.returnStationName
                }\nDistance covered: ${distance(
                  item.coveredDistance
                )}\nDuration: ${time(
                  item.duration
                )}\nAverage speed: ${averageSpeed(
                  item.coveredDistance,
                  item.duration
                )} km/h`}
              </Text>
            </View>
          )
        }}
      />
    </View>
  )
}

export default BiketripList
