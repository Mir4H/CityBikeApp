import { Card, Text, Avatar, Button } from 'react-native-paper'
import React from 'react'
const date = require('date-and-time')
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-native'
import { StyleSheet, View } from 'react-native'

const DetailsCard = ({ item, listing }) => {
  const getMinutes = Math.floor(item.duration / 60)
  const getSeconds = item.duration - getMinutes * 60
  const getHours = Math.floor(getMinutes / 60)
  const averageSpeed = ((item.coveredDistance / item.duration) * 3.6).toFixed(2)
  const location = useLocation()
  const navigate = useNavigate()
  const [randomImages] = useState([
    require('../../assets/bike.jpeg'),
    require('../../assets/bike1.jpeg'),
    require('../../assets/bike2.jpeg'),
    require('../../assets/bike3.jpeg'),
    require('../../assets/bike4.jpeg'),
    require('../../assets/bike5.jpeg'),
    require('../../assets/bike6.jpeg'),
    require('../../assets/bike7.jpeg'),
    require('../../assets/bike8.jpeg'),
    require('../../assets/bike9.jpeg')
  ])

  const randomImage = () => {
    const img = Math.floor(Math.random() * randomImages.length)
    return randomImages[img]
  }
  if (listing) {
    const img = randomImage()
    return (
      <>
        <Card
          onPress={() => navigate(`/${item.id}`, { state: { image: img } })}
        >
          <Card.Title
            title={`${item.departureStationName} - ${item.returnStationName}`}
            subtitle={`${(item.coveredDistance / 1000).toFixed(2)} km in ${
              getMinutes > 60
                ? `${getHours} hours, ${getMinutes - getHours * 60}`
                : getMinutes
            } minutes and ${getSeconds} seconds`}
            left={() => (
              <Avatar.Image
                size={45}
                source={img}
                style={{ backgroundColor: '#63a8a7' }}
              />
            )}
          />
        </Card>
      </>
    )
  } else {
    return (
      <Card>
        <Card.Cover source={location.state.image} />
        <View style={{ flexDirection: 'row' }}>
          <Button
            style={styles.button}
            onPress={() => navigate(`/stations/${item.departureStationId}`)}
          >
            <Text variant="titleMedium">{item.departureStationName}</Text>
          </Button>
          <Text variant="titleMedium" style={{ marginVertical: 15 }}>
            {' - '}
          </Text>
          <Button
            style={styles.button}
            onPress={() => navigate(`/stations/${item.returnStationId}`)}
          >
            <Text variant="titleMedium">{item.returnStationName}</Text>
          </Button>
        </View>
        <Card.Content>
          <Text variant="bodyMedium">
            Biketrip started{' '}
            {date.format(
              new Date(item.departureTime),
              'DD.MM.YYYY at HH:mm:ss'
            )}{' '}
            {'\n'}and ended{' '}
            {date.format(new Date(item.returnTime), 'DD.MM.YYYY at HH:mm:ss.')}
            {'\n'}
          </Text>
          <Text variant="bodyMedium">
            Biked {(item.coveredDistance / 1000).toFixed(2)} km in{' '}
            {getMinutes > 60
              ? `${getHours} hours, ${getMinutes - getHours * 60}`
              : getMinutes}{' '}
            minutes and {getSeconds} seconds
          </Text>
          <Text variant="bodyMedium">Average speed {averageSpeed} km/h</Text>
        </Card.Content>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderColor: '#63615b',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10
  }
})

export default DetailsCard
