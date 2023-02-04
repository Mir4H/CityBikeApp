import { Card, Text } from 'react-native-paper'
import React from 'react'
const date = require('date-and-time')

const DetailsCard = ({ item, listing, navigate }) => {
  const getMinutes = Math.floor(item.duration / 60)
  const getSeconds = item.duration - getMinutes * 60
  const getHours = Math.floor(getMinutes / 60)
  const averageSpeed = ((item.coveredDistance / item.duration) * 3.6).toFixed(2)

  if (listing) {
    return (
      <>
        <Card onPress={() => navigate(`/${item.id}`)}>
          <Card.Title
            title={`${item.departureStationName} - ${item.returnStationName}`}
            subtitle={`${(item.coveredDistance / 1000).toFixed(2)} km in ${
              getMinutes > 60
                ? `${getHours} hours, ${getMinutes - getHours * 60}`
                : getMinutes
            } minutes and ${getSeconds} seconds`}
          />
        </Card>
      </>
    )
  } else {
    return (
      <Card onPress={() => console.log(item.id)}>
        <Card.Cover
          source={require('../../assets/bike.jpeg')}
        />
        <Card.Title
          title={`${item.departureStationName} - ${item.returnStationName}`}
        />
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

export default DetailsCard
