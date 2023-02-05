import { Button, Card, Text } from 'react-native-paper'
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView
} from 'react-native'
import { useState, useEffect } from 'react'
import React from 'react'
import { useParams, useNavigate } from 'react-router-native'
import axios from 'axios'
import TopBar from './TopBar'

const StationButtons = ({ name, id }) => {
  const navigate = useNavigate()
  return (
    <Button
      style={styles.button}
      labelStyle={{ color: '#736f66' }}
      onPress={() => {
        navigate(`/stations/${id}`)
      }}
    >
      {name}
    </Button>
  )
}

const StationDetails = () => {
  const [station, setStation] = useState()
  const [stationInfo, setStationInfo] = useState()
  const { id } = useParams()
  const getStation = async () => {
    const stationData = await axios.get(
      `http://192.168.1.130:3001/api/bikestations/${id}`
    )
    const stationInfo = await axios.get(
      `http://192.168.1.130:3001/api/stationValues/${id}`
    )
    setStation(stationData.data)
    setStationInfo(stationInfo.data)
  }
  useEffect(() => {
    getStation()
  }, [id])

  if (!station || !stationInfo) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }
  return (
    <>
      <TopBar unique={true} title="Station Details" />
      <ScrollView>
        <Card>
          <Card.Cover source={require('../../assets/bikes.jpeg')} />
          <Card.Content>
            <Text variant="titleLarge" style={{ marginTop: 5 }}>
              {station.nameFinnish} | {station.nameSwedish}
            </Text>
            <Text variant="bodyMedium">
              {station.addressFinnish}{' '}
              {station.cityFinnish ? `, ${station.cityFinnish}` : null} |{' '}
              {station.addressSwedish}{' '}
              {station.citySwedish ? `, ${station.citySwedish}` : null}
            </Text>
            <Text variant="titleLarge" style={{ marginTop: 5 }}>
              Info
            </Text>
            <Text variant="bodyMedium">
              Operator: {station.operator ? station.operator : 'not known'}
            </Text>
            <Text variant="bodyMedium">
              Capacity: {station.capacity ? station.capacity : 'not known'}
            </Text>
            <Text variant="titleLarge" style={{ marginTop: 5 }}>
              Statistics
            </Text>
            <Text variant="bodyMedium">
              {`Total started trips: ${stationInfo.tripsStarted}`}
            </Text>
            <Text variant="bodyMedium">
              {`Total ended trips: ${stationInfo.tripsEnded}`}
            </Text>
            <Text variant="titleLarge" style={{ marginTop: 5 }}>
              Popular return stations
            </Text>
            {stationInfo.popularReturnStations.map((item) => {
              return (
                <StationButtons
                  key={item.returnStationId}
                  name={item.returnStationName}
                  id={item.returnStationId}
                />
              )
            })}
            <Text variant="titleLarge" style={{ marginTop: 5 }}>
              Popular departure stations
            </Text>
            {stationInfo.popularDepartureStations.map((item) => {
              return (
                <StationButtons
                  key={item.departureStationId}
                  name={item.departureStationName}
                  id={item.departureStationId}
                />
              )
            })}
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderColor: '#736f66',
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 5
  }
})
export default StationDetails
