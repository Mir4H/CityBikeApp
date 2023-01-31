import { useState } from 'react'
import { Appbar, Menu, Divider } from 'react-native-paper'

const TopBar = ({ searchVisible, setSearchVisible }) => {
  const [menuVisible, setMenuVisible] = useState(false)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)
  const openSearch = () => setSearchVisible(!searchVisible)

  return (
    <Appbar.Header>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" onPress={openMenu} />}
      >
        <Menu.Item onPress={() => {}} title="Biketrips" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Bike Stations" />
      </Menu>
      <Appbar.Content title="Citybike trips" />
      <Appbar.Action icon="magnify" onPress={openSearch} />
    </Appbar.Header>
  )
}

export default TopBar
