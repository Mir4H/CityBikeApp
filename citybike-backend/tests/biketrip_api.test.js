const supertest = require('supertest')
const app = require('../index')
const sequelize = require('../utils/db').sequelize
const Biketrip = require('../models/biketrip')

beforeEach(async () => {
  try {
    Biketrip.sync()
    await Biketrip.truncate()
    await Biketrip.bulkCreate(initialBiketrips, { validate: true })
  } catch (error) {
    console.log(error)
  }
})
describe('Biketrips API working correctly', () => {
  test('biketrips are returned as json', async () => {
    await supertest(app)
      .get('/api/biketrips')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('One query returns 15 biketrips', async () => {
    const response = await supertest(app).get('/api/biketrips')
    expect(response.body.biketrips).toHaveLength(15)
  })

  test('all biketrips have id fields', async () => {
    const response = await supertest(app).get('/api/biketrips')
    response.body.biketrips.forEach((item) => expect(item.id).toBeDefined())
  })

  test('total items is 20', async () => {
    const response = await supertest(app).get('/api/biketrips')
    expect(response.body.totalItems).toBe(20)
  })

  test('current page is 0', async () => {
    const response = await supertest(app).get('/api/biketrips')
    expect(response.body.currentPage).toBe(0)
  })

  test('total pages is 2', async () => {
    const response = await supertest(app).get('/api/biketrips')
    expect(response.body.totalPages).toBe(2)
  })

  test('Get biketrip by id', async () => {
    const testTrip = await Biketrip.findOne()
    const response = await supertest(app).get(`/api/biketrips/${testTrip.id}`)
    expect(JSON.stringify(response.body)).toBe(JSON.stringify(testTrip))
  })

  test('distances 2000-4000m return 3 biketrips', async () => {
    const response = await supertest(app).get(
      '/api/biketrips?distance=2000,4000'
    )
    expect(response.body.biketrips).toHaveLength(3)
  })

  test('duration 200-300 s to return 3 biketrips', async () => {
    const response = await supertest(app).get('/api/biketrips?duration=200,300')
    expect(response.body.biketrips).toHaveLength(3)
  })

  test('search Laajalahden returns 2 biketrips with Laajalahden aukio as departure station', async () => {
    const response = await supertest(app).get(
      '/api/biketrips?search=Laajalahden'
    )
    expect(response.body.biketrips).toHaveLength(2)
    expect(response.body.biketrips[0].departureStationName).toBe(
      'Laajalahden aukio'
    )
    expect(response.body.biketrips[1].departureStationName).toBe(
      'Laajalahden aukio'
    )
  })

  test('Order by distance descending first item is longest distance (20000m)', async () => {
    const response = await supertest(app).get(
      '/api/biketrips?order=coveredDistance,DESC'
    )
    expect(response.body.biketrips[0].coveredDistance).toBe('20000')
  })
})

describe('Statistics calculated correctly', () => {
  test('maxdistance is 20000, maxduration 1050', async () => {
    const response = await supertest(app).get('/api/values')
    expect(response.body.maxdistance).toBe(20000)
    expect(response.body.maxduration).toBe(1050)
  })

  test('Station nro 4 has tripsStarted 2, tripsEnded 1, startedDistanceAvg: 450, endedDistanceAvg: 600, popularDepartureStations: 292, popularReturnStations: 65', async () => {
    const response = await supertest(app).get('/api/stationvalues/4')
    expect(response.body.tripsStarted).toBe(2)
    expect(response.body.tripsEnded).toBe(1)
    expect(response.body.startedDistanceAvg).toBe('4.50')
    expect(response.body.endedDistanceAvg).toBe('6.00')
    expect(response.body.popularDepartureStations[0].departureStationId).toBe(
      292
    )
    expect(response.body.popularReturnStations[0].returnStationId).toBe(65)
  })
})

afterAll(async () => {
  await sequelize.close()
})

const initialBiketrips = [
  {
    departureTime: '2021-05-31T20:57:25.000Z',
    returnTime: '2021-05-31T21:05:46.000Z',
    departureStationId: 94,
    departureStationName: 'Laajalahden aukio',
    returnStationId: 100,
    returnStationName: 'Teljäntie',
    coveredDistance: '1000',
    duration: '100',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:56:59.000Z',
    returnTime: '2021-05-31T21:07:14.000Z',
    departureStationId: 82,
    departureStationName: 'Töölöntulli',
    returnStationId: 113,
    returnStationName: 'Pasilan asema',
    coveredDistance: '2000',
    duration: '150',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:56:44.000Z',
    returnTime: '2021-05-31T21:03:26.000Z',
    departureStationId: 123,
    departureStationName: 'Näkinsilta',
    returnStationId: 121,
    returnStationName: 'Vilhonvuorenkatu',
    coveredDistance: '3000',
    duration: '200',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:56:23.000Z',
    returnTime: '2021-05-31T21:29:58.000Z',
    departureStationId: 4,
    departureStationName: 'Viiskulma',
    returnStationId: 65,
    returnStationName: 'Hernesaarenranta',
    coveredDistance: '4000',
    duration: '250',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:56:11.000Z',
    returnTime: '2021-05-31T21:02:02.000Z',
    departureStationId: 4,
    departureStationName: 'Viiskulma',
    returnStationId: 65,
    returnStationName: 'Hernesaarenranta',
    coveredDistance: '5000',
    duration: '300',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:54:48.000Z',
    returnTime: '2021-05-31T21:00:57.000Z',
    departureStationId: 292,
    departureStationName: 'Koskelan varikko',
    returnStationId: 4,
    returnStationName: 'Viiskulma',
    coveredDistance: '6000',
    duration: '350',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:54:11.000Z',
    returnTime: '2021-05-31T21:17:11.000Z',
    departureStationId: 34,
    departureStationName: 'Kansallismuseo',
    returnStationId: 81,
    returnStationName: 'Stenbäckinkatu',
    coveredDistance: '7000',
    duration: '400',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:53:04.000Z',
    returnTime: '2021-05-31T21:14:52.000Z',
    departureStationId: 240,
    departureStationName: 'Viikin normaalikoulu',
    returnStationId: 281,
    returnStationName: 'Puotila (M)',
    coveredDistance: '8000',
    duration: '450',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:52:03.000Z',
    returnTime: '2021-05-31T21:15:16.000Z',
    departureStationId: 116,
    departureStationName: 'Linnanmäki',
    returnStationId: 117,
    returnStationName: 'Brahen puistikko',
    coveredDistance: '9000',
    duration: '500',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:50:19.000Z',
    returnTime: '2021-05-31T21:05:58.000Z',
    departureStationId: 116,
    departureStationName: 'Linnanmäki',
    returnStationId: 145,
    returnStationName: 'Pohjolankatu',
    coveredDistance: '10000',
    duration: '550',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:50:05.000Z',
    returnTime: '2021-05-31T21:01:22.000Z',
    departureStationId: 147,
    departureStationName: 'Käpylän asema',
    returnStationId: 232,
    returnStationName: 'Oulunkylän asema',
    coveredDistance: '11000',
    duration: '600',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:50:00.000Z',
    returnTime: '2021-05-31T20:55:48.000Z',
    departureStationId: 69,
    departureStationName: 'Kalevankatu',
    returnStationId: 62,
    returnStationName: 'Välimerenkatu',
    coveredDistance: '12000',
    duration: '650',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:49:59.000Z',
    returnTime: '2021-05-31T20:59:49.000Z',
    departureStationId: 147,
    departureStationName: 'Käpylän asema',
    returnStationId: 232,
    returnStationName: 'Oulunkylän asema',
    coveredDistance: '13000',
    duration: '700',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:49:59.000Z',
    returnTime: '2021-05-31T20:55:38.000Z',
    departureStationId: 69,
    departureStationName: 'Kalevankatu',
    returnStationId: 62,
    returnStationName: 'Välimerenkatu',
    coveredDistance: '14000',
    duration: '750',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:49:36.000Z',
    returnTime: '2021-05-31T21:40:20.000Z',
    departureStationId: 547,
    departureStationName: 'Jämeräntaival',
    returnStationId: 547,
    returnStationName: 'Jämeräntaival',
    coveredDistance: '15000',
    duration: '800',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:40:48.000Z',
    returnTime: '2021-05-31T20:55:06.000Z',
    departureStationId: 703,
    departureStationName: 'Elfvik',
    returnStationId: 725,
    returnStationName: 'Rummunlyöjänkatu',
    coveredDistance: '16000',
    duration: '850',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:39:12.000Z',
    returnTime: '2021-05-31T20:45:44.000Z',
    departureStationId: 43,
    departureStationName: 'Karhupuisto',
    returnStationId: 115,
    returnStationName: 'Venttiilikuja',
    coveredDistance: '17000',
    duration: '900',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:38:39.000Z',
    returnTime: '2021-05-31T20:43:38.000Z',
    departureStationId: 30,
    departureStationName: 'Itämerentori',
    returnStationId: 201,
    returnStationName: 'Länsisatamankuja',
    coveredDistance: '18000',
    duration: '950',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:38:24.000Z',
    returnTime: '2021-05-31T20:42:45.000Z',
    departureStationId: 94,
    departureStationName: 'Laajalahden aukio',
    returnStationId: 90,
    returnStationName: 'Paciuksenkaari',
    coveredDistance: '19000',
    duration: '1000',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  },
  {
    departureTime: '2021-05-31T20:37:28.000Z',
    returnTime: '2021-05-31T20:47:30.000Z',
    departureStationId: 9,
    departureStationName: 'Erottajan aukio',
    returnStationId: 61,
    returnStationName: 'Länsisatamankatu',
    coveredDistance: '20000',
    duration: '1050',
    createdAt: '2023-02-05T09:01:22.528Z',
    updatedAt: '2023-02-05T09:01:22.528Z'
  }
]
