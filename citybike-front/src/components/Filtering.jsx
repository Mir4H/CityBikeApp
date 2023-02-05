import React, { useState, useEffect } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import axios from 'axios'
import _ from 'lodash'
import { Url } from './BiketripDetails'

const Filtering = ({ setFilters, setFilterVisible, filterVisible }) => {
  const [durationValues, setDurationValues] = useState([])
  const [distanceValues, setDistanceValues] = useState([])
  const durationValuesChange = (values) => setDurationValues(values)
  const distanceValuesChange = (values) => setDistanceValues(values)

  const getValues = async () => {
    const response = await axios.get(`${Url}/api/values`)
    const { maxdistance, maxduration } = response.data
    const durationValues = [
      ..._.range(100),
      ..._.range(150, 1000, 50),
      ..._.range(1000, Math.floor(maxduration / 60) + 1000, 1000)
    ]
    const distanceValues = [
      ..._.range(20),
      ..._.range(20, 35, 5),
      ...[35, Math.floor(maxdistance / 1000) + 1]
    ]
    setDurationValues(durationValues)
    setDistanceValues(distanceValues)
  }

  const handleSubmit = () => {
    setFilters(
      `distance=${distanceValues[0] * 1000},${
        distanceValues[distanceValues.length - 1] * 1000
      }&duration=${durationValues[0] * 60},${
        durationValues[durationValues.length - 1] * 60}`
    )
    setFilterVisible(!filterVisible)
    console.log([
      distanceValues[0] * 1000,
      distanceValues[distanceValues.length - 1] * 1000
    ])
  }

  useEffect(() => {
    setFilters('')
    getValues()
  }, [])

  if (!durationValues || !distanceValues) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <>
      <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
        <View style={{ margin: 5, justifyContent: 'center' }}>
          <Text>Duration in minutes</Text>
          <MultiSlider
            markerStyle={options.markerStyle}
            pressedMarkerStyle={options.pressedMarkerStyle}
            selectedStyle={options.selectedStyle}
            trackStyle={options.trackStyle}
            touchDimensions={options.touchDimensions}
            values={[
              durationValues[0],
              durationValues[durationValues.length - 1]
            ]}
            onValuesChange={durationValuesChange}
            optionsArray={durationValues}
            allowOverlap={false}
            minMarkerOverlapDistance={1}
          />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text>{durationValues[0]} </Text>
            <Text>{durationValues[durationValues.length - 1]} </Text>
          </View>
          <Text style={{ marginTop: 20 }}>Distance in km </Text>

          <MultiSlider
            markerStyle={options.markerStyle}
            pressedMarkerStyle={options.pressedMarkerStyle}
            selectedStyle={options.selectedStyle}
            trackStyle={options.trackStyle}
            touchDimensions={options.touchDimensions}
            values={[
              distanceValues[0],
              distanceValues[distanceValues.length - 1]
            ]}
            onValuesChange={distanceValuesChange}
            optionsArray={distanceValues}
            allowOverlap={false}
            minMarkerOverlapDistance={1}
          />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text>{distanceValues[0]} </Text>
            <Text>{distanceValues[distanceValues.length - 1]} </Text>
          </View>
        </View>
      </View>
      <Pressable onPress={handleSubmit}>
        <View style={styles.button}>
          <Text>Submit</Text>
        </View>
      </Pressable>
    </>
  )
}
const styles = StyleSheet.create({
  button: {
    width: 100,
    alignItems: 'center',
    borderColor: '#736f66',
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 60
  }
})

const options = {
  markerStyle: {
    height: 15,
    width: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 1,
    shadowOpacity: 0.1
  },
  pressedMarkerStyle: {
    height: 25,
    width: 25,
    borderRadius: 20,
    backgroundColor: '#736f66'
  },
  selectedStyle: {
    backgroundColor: '#736f66'
  },
  trackStyle: {
    backgroundColor: '#CECECE'
  },
  touchDimensions: {
    height: 450,
    width: 50,
    borderRadius: 30,
    slipDisplacement: 40
  }
}

export default Filtering
