import { useState } from 'react'
import { Appbar, Menu, Divider } from 'react-native-paper'

const TopBar = ({ searchVisible, setSearchVisible, setSortBy, filterVisible, setFilterVisible, setFilters, setSearchStation }) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [sortVisible, setSortVisible] = useState(false)

  const sortMenu = () => setSortVisible(!sortVisible)
  const menu = () => setMenuVisible(!menuVisible)
  const openSearch = () => setSearchVisible(!searchVisible)
  const openFilter = () => setFilterVisible(!filterVisible)

  const sorting = (value) => {
    setSortBy(value)
    sortMenu()
  }

  const resetAll = () => {
    setFilters('')
    setSearchStation('')
    setSortBy('id')
    menu()
  }

  return (
    <Appbar.Header>
      <Menu
        visible={menuVisible}
        onDismiss={menu}
        anchor={<Appbar.Action icon="menu" onPress={menu} />}
      >
        <Menu.Item onPress={() => {}} title="Biketrips" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Bike Stations" />
        <Divider />
        <Menu.Item onPress={resetAll} title="Reset all" />
      </Menu>
      <Appbar.Content title="Citybike trips" />
      <Appbar.Action icon="magnify" onPress={openSearch} />
      <Appbar.Action icon="filter-variant" onPress={openFilter} />
      <Menu
        visible={sortVisible}
        onDismiss={sortMenu}
        anchor={<Appbar.Action icon="sort" onPress={sortMenu} />}
      >
        <Menu.Item onPress={() => {sorting('duration,ASC')}} title="Shortest duration" />
        <Divider />
        <Menu.Item onPress={() => {sorting('duration,DESC')}} title="Longest duration" />
        <Divider />
        <Menu.Item onPress={() => {sorting('coveredDistance,ASC')}} title="Shortest distance" />
        <Divider />
        <Menu.Item onPress={() => {sorting('coveredDistance,DESC')}} title="Longest distance" />
      </Menu>
    </Appbar.Header>
  )
}

export default TopBar
