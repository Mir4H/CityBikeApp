import { useState, useEffect } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { Card } from 'react-native-paper'
import React from 'react'

const styles = StyleSheet.create({
  separator: {
    height: 5,
    width: '100%'
  }
})

const ItemSeparator = () => <View style={styles.separator} />

export class BiketripListContainer extends React.Component {
  renderItem = ({ item, index }) => {
    const getMinutes = Math.floor(item.duration / 60)
    const getSeconds = item.duration - getMinutes * 60
    console.log(index)

    return (
      <Card onPress={() => console.log(item.id)}>
        <Card.Title
          title={`${item.departureStationName} - ${item.returnStationName}`}
          subtitle={`${(item.coveredDistance / 1000).toFixed(
            2
          )} km in ${getMinutes} minutes and ${getSeconds} seconds`}
        />
      </Card>
    )
  }

  render() {
    const { biketripData, onEndReached } = this.props

    return (
      <FlatList
        data={biketripData}
        ItemSeparatorComponent={ItemSeparator}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={this.renderItem}
      />
    )
  }
}

const BiketripList = () => {
  const [biketripData, setBiketripData] = useState([])
  const [page, setPage] = useState(0)

  const fetchBiketrips = async () => {
    const response = await fetch(
      `http://192.168.1.130:3001/api/biketrips?page=${page}`
    )
    const json = await response.json()

    console.log(json.biketrips)
    setPage(page + 1)
    setBiketripData([...biketripData, ...json.biketrips])
  }

  useEffect(() => {
    fetchBiketrips()
    console.log(page)
  }, [])

  return (
    <View>
      <BiketripListContainer
        biketripData={biketripData}
        onEndReached={fetchBiketrips}
      />
    </View>
  )
}

export default BiketripList
