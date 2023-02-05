import { useState } from 'react'
import { Appbar, Menu, Divider } from 'react-native-paper'
import { useNavigate } from 'react-router-native'

const TopBar = ({
  searchVisible,
  setSearchVisible,
  setSortBy,
  filterVisible,
  setFilterVisible,
  setFilters,
  setSearchStation,
  unique,
  title
}) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [sortVisible, setSortVisible] = useState(false)
  const sortMenu = () => setSortVisible(!sortVisible)
  const menu = () => setMenuVisible(!menuVisible)
  const openSearch = () => setSearchVisible(!searchVisible)
  const openFilter = () => setFilterVisible(!filterVisible)
  const navigate = useNavigate()
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

  if (unique) {
    return (
      <Appbar.Header>
        <Appbar.Action icon="arrow-left" onPress={() => navigate(-1)} />
        <Appbar.Content title={title} />
        <Menu
          visible={menuVisible}
          onDismiss={menu}
          anchor={<Appbar.Action icon="menu" onPress={menu} />}
        >
          <Menu.Item onPress={() => {navigate('/')}} title="Biketrips" />
          <Divider />
          <Menu.Item onPress={() => {navigate('/bikestations')}} title="Bike Stations" />
        </Menu>
      </Appbar.Header>
    )
  }
  return (
    <Appbar.Header>
      <Menu
        visible={menuVisible}
        onDismiss={menu}
        anchor={<Appbar.Action icon="menu" onPress={menu} />}
      >
        {setSortBy ? (
          <>
            <Menu.Item
              onPress={() => {
                navigate('/bikestations')
              }}
              title="Bike Stations"
            />
            <Divider />
            <Menu.Item onPress={resetAll} title="Reset all" />
          </>
        ) : (
          <Menu.Item
            onPress={() => {
              navigate('/')
            }}
            title="Biketrips"
          />
        )}
      </Menu>
      <Appbar.Content title={title} />
      <Appbar.Action icon="magnify" onPress={openSearch} />
      {setSortBy ? (
        <>
          <Appbar.Action icon="filter-variant" onPress={openFilter} />
          <Menu
            visible={sortVisible}
            onDismiss={sortMenu}
            anchor={<Appbar.Action icon="sort" onPress={sortMenu} />}
          >
            <Menu.Item
              onPress={() => {
                sorting('duration,ASC')
              }}
              title="Shortest duration"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                sorting('duration,DESC')
              }}
              title="Longest duration"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                sorting('coveredDistance,ASC')
              }}
              title="Shortest distance"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                sorting('coveredDistance,DESC')
              }}
              title="Longest distance"
            />
          </Menu>
        </>
      ) : null}
    </Appbar.Header>
  )
}

export default TopBar
