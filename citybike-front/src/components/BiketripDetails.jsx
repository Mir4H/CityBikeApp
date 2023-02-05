import { useState, useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import React from 'react'
import TopBar from './TopBar'
import axios from 'axios'
import { useParams } from 'react-router-native'
import DetailsCard from './DetailsCard'
export const Url = 'http://192.168.1.130:3001'

const BiketripDetails = () => {
  const [biketrip, setBiketrip] = useState()
  const { id } = useParams()
  const getBiketrip = async () => {
    const biketrip = await axios.get(
      `${Url}/api/biketrips/${id}`
    )
    setBiketrip(biketrip.data)
  }

  useEffect(() => {
    getBiketrip()
  }, [])

  if (!biketrip) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <>
      <TopBar unique={true} title={'Trip Details'}/>
      <DetailsCard listing={false} item={biketrip} />
    </>
  )
}

export default BiketripDetails
