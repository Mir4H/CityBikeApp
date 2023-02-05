import { useState, useEffect } from 'react'
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native'
import { Searchbar } from 'react-native-paper'
import React from 'react'
import { useDebounce } from 'use-debounce'
import TopBar from './TopBar'
import axios from 'axios'
import { useNavigate } from 'react-router-native'
import { Card, Avatar } from 'react-native-paper'


const styles = StyleSheet.create({
  separator: {
    height: 5,
    width: '100%'
  }
})

const ItemSeparator = () => <View style={styles.separator} />

export class StationListContainer extends React.Component {
  renderItem = ({ item }) => {
    const { navigate } = this.props
    return (
      <Card onPress={() => navigate(`/stations/${item.id}`) }>
        <Card.Title
          title={`${item.nameFinnish}`}
          subtitle={`${item.nameSwedish}`}
          left={() => (
            <Avatar.Text
              size={45}
              style={{ backgroundColor: '#63a8a7' }}
              color={'#1b2e2e'}
              label={item.nameFinnish.slice(0, 2)}
            />
          )}
        />
      </Card>
    )
  }

  render() {
    const { stationData, onEndReached, fetching } = this.props

    return (
      <FlatList
        data={stationData}
        ItemSeparatorComponent={ItemSeparator}
        onEndReachedThreshold={0.2}
        keyExtractor={(item) => item.id}
        renderItem={this.renderItem}
        onEndReached={onEndReached}
        scrollEnabled={!fetching}
      />
    )
  }
}

const StationList = () => {
  const [stationData, setStationData] = useState([])
  const [page, setPage] = useState(0)
  const [searchStation, setSearchStation] = useState('')
  const [searchValue] = useDebounce(searchStation, 500)
  const [loading, setLoading] = useState(true)
  const [searchVisible, setSearchVisible] = useState(false)
  const [fetching, setFetching] = useState(false)
  const onChangeSearch = (text) => setSearchStation(text)
  const navigate = useNavigate()

  const fetchStations = async () => {
    setLoading(true)
    const response = await axios.get(
      `http://192.168.1.130:3001/api/bikestations?page=${0}&search=${searchValue}`
    )
    setStationData(response.data.bikestations)
    setPage(page + 1)
    setLoading(false)
  }

  const fetchMore = async () => {
    setFetching(true)
    const response = await axios.get(
      `http://192.168.1.130:3001/api/bikestations?page=${page}&search=${searchValue}`
    )

    setStationData([...stationData, ...response.data.bikestations])
    setPage(page + 1)
    setFetching(false)
  }

  useEffect(() => {
    setStationData([])
    fetchStations()
  }, [searchValue])

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        title={'Citybike Stations'}
        searchVisible={searchVisible}
        setSearchVisible={setSearchVisible}
        setSearchStation={setSearchStation}
        navigate={navigate}
      />
      {searchVisible ? (
        <Searchbar
          style={{ margin: 5 }}
          placeholder="Search by stations"
          onChangeText={onChangeSearch}
          value={searchStation}
        />
      ) : null}
      {loading ? (
        <View style={{ margin: 15 }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <StationListContainer
          stationData={stationData}
          onEndReached={fetchMore}
          searchVisible={searchVisible}
          setSearchVisible={setSearchVisible}
          fetching={fetching}
          navigate={navigate}
        />
      )}
    </View>
  )
}

export default StationList
