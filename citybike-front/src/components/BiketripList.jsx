import { useState, useEffect } from 'react'
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native'
import { Searchbar } from 'react-native-paper'
import React from 'react'
import { useDebounce } from 'use-debounce'
import TopBar from './TopBar'
import axios from 'axios'
import Filtering from './Filtering'
import { useNavigate } from 'react-router-native'
import DetailsCard from './DetailsCard'
import { Url } from './Main'

const styles = StyleSheet.create({
  separator: {
    height: 5,
    width: '100%'
  }
})

const ItemSeparator = () => <View style={styles.separator} />

export class BiketripListContainer extends React.Component {
  renderItem = ({ item }) => {
    return <DetailsCard item={item} listing={true} />
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
      `${Url}/api/biketrips?page=${0}&search=${searchValue}&order=${sortBy}&${filters}`
    )
    setBiketripData(response.data.biketrips)
    setPage(page + 1)
    setLoading(false)
  }

  const fetchMore = async () => {
    setFetching(true)
    const response = await axios.get(
      `${Url}/api/biketrips?page=${page}&search=${searchValue}&order=${sortBy}&${filters}`
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
        title={'Citybike Trips'}
        searchVisible={searchVisible}
        filterVisible={filterVisible}
        setSearchVisible={setSearchVisible}
        setFilterVisible={setFilterVisible}
        setSortBy={setSortBy}
        setSearchStation={setSearchStation}
        setFilters={setFilters}
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
        />
      )}
    </View>
  )
}

export default BiketripList
