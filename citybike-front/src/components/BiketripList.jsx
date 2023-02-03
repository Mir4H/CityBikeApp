import { useState, useEffect } from 'react'
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native'
import { Card, Searchbar } from 'react-native-paper'
import React from 'react'
import { useDebounce } from 'use-debounce'
import TopBar from './TopBar'
import axios from 'axios'
import Filtering from './Filtering'
import { useNavigate } from 'react-router-native'

const styles = StyleSheet.create({
  separator: {
    height: 5,
    width: '100%'
  }
})

const ItemSeparator = () => <View style={styles.separator} />

export class BiketripListContainer extends React.Component {
  renderItem = ({ item }) => {
    const getMinutes = Math.floor(item.duration / 60)
    const getSeconds = item.duration - getMinutes * 60
    const getHours = Math.floor(getMinutes / 60)

    return (
      <Card onPress={() => console.log(item.id)}>
        <Card.Title
          title={`${item.departureStationName} - ${item.returnStationName}`}
          subtitle={`${(item.coveredDistance / 1000).toFixed(2)} km in ${
            getMinutes > 60
              ? `${getHours} hours, ${getMinutes - getHours * 60}`
              : getMinutes
          } minutes and ${getSeconds} seconds`}
        />
      </Card>
    )
  }

  render() {
    const { biketripData, onEndReached, fetching } = this.props

    return (
      <FlatList
        data={biketripData}
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

const BiketripList = () => {
  const [biketripData, setBiketripData] = useState([])
  const [page, setPage] = useState(0)
  const [searchStation, setSearchStation] = useState('')
  const [searchValue] = useDebounce(searchStation, 500)
  const [loading, setLoading] = useState(true)
  const [searchVisible, setSearchVisible] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [sortBy, setSortBy] = useState('')
  const [fetching, setFetching] = useState(false)
  const [filters, setFilters] = useState('')
  const onChangeSearch = (text) => setSearchStation(text)
  const navigate = useNavigate()

  const fetchBiketrips = async () => {
    setLoading(true)
    const response = await axios.get(
      `http://192.168.1.130:3001/api/biketrips?page=${0}&search=${searchValue}&order=${sortBy}&${filters}`
    )
    setBiketripData(response.data.biketrips)
    setPage(page + 1)
    setLoading(false)
  }

  const fetchMore = async () => {
    setFetching(true)
    const response = await axios.get(
      `http://192.168.1.130:3001/api/biketrips?page=${page}&search=${searchValue}&order=${sortBy}&${filters}`
    )

    setBiketripData([...biketripData, ...response.data.biketrips])
    setPage(page + 1)
    setFetching(false)
  }

  useEffect(() => {
    setBiketripData([])
    fetchBiketrips()
  }, [searchValue, sortBy, filters])

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        searchVisible={searchVisible}
        filterVisible={filterVisible}
        setSearchVisible={setSearchVisible}
        setFilterVisible={setFilterVisible}
        setSortBy={setSortBy}
        setSearchStation={setSearchStation}
        setFilters={setFilters}
      />
      {searchVisible ? (
        <Searchbar
          style={{ margin: 5 }}
          placeholder="Search by stations"
          onChangeText={onChangeSearch}
          value={searchStation}
        />
      ) : null}
      {filterVisible ? (
        <Filtering
          setFilters={setFilters}
          filterVisible={filterVisible}
          setFilterVisible={setFilterVisible}
        />
      ) : null}
      {loading ? (
        <View style={{ margin: 15 }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <BiketripListContainer
          biketripData={biketripData}
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

export default BiketripList
