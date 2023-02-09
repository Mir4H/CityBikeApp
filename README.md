# City Bike App

An app that I created to try out what I could do with some open data. This is an app that lists HSL city bike journeys and stations. Every journey and station also has a details page for more information. Journeys can be sorted and filtered by journey duration and distance covered. Stations and journeys may also be searched by station name. </br>

## Test it!
You can test the app on Expo Go, please find it here: https://expo.dev/@mir4ha/citybike-app?serviceType=classic&distribution=expo-go</br>

## Screenshots
<p float="left">
<img src="https://user-images.githubusercontent.com/77398611/216816093-3ad826c9-656d-43e0-9b1b-549e63a54f35.PNG" width="260" />
<img src="https://user-images.githubusercontent.com/77398611/216816221-ff4c7669-7b71-48fc-aae1-4e9c6080059a.PNG" width="260" />
</p>
<p float="left">
<img src="https://user-images.githubusercontent.com/77398611/216816235-ad398800-d61f-4761-98ba-7c86deeda9be.PNG" width="260" />
<img src="https://user-images.githubusercontent.com/77398611/216816262-e7dc2355-4ec9-4be2-8cc0-613eb59abc16.PNG" width="260" />
</p>

## Tech Stack

The backend is build with NodeJs and Express, with PostgreSQL as a database with Sequelize ORM. </br>
The frontend is build using React Native with Expo framework.
IPhone (iOS) was used for testing the app durning development.

## Run the project locally
#### Backend
* Install Nodejs and npm => https://nodejs.org/en/download/
* Clone the repository and move to the directory .\CityBikeApp\citybike-backend\
* Create .env file and add a PostgreSQL database URL in a variable called DATABASE_URL=address
* Run 'npm install' to install all dependencies. 
* I was using Fly.io, here in order to connect to the Fly Postgres database forward the server port to your local system with fly proxy: fly proxy 5432 -a postgres-app-name. For a psql shell: fly postgres connect -a postgres-app-name
* Now you're set and can run the backend with command: 'npm start' for production mode or 'npm run dev' to run it with nodemon in development mode.
* To run the tests you need to add a test database url to the .env file in a variable called TEST_DATABASE_URL=address an Run 'npm test'.
#### Frontend
* Move to the directory .\CityBikeApp\citybike-front and run 'npm install' to install all dependencies. 
* Run: 'npx expo start' to run the Expo project. 
* Copy the IP address between the exp:// and :, for example 192.168.1.130 and add port 3001, in format http://<IP_ADDRESS>:3001 . Make sure to add that URL in the BiketripDetails.jsx 'export const Url = 'http://192.168.1.130:3001''.
* To see the project running, you'll need to have the Expo Go App on your mobile device. Once you have it scan the QR code with Expo Go (Android) or the Camera app (iOS) and open the project in the app.

## To Do
* At the moment there is no possibility for the user to add data. That feature needs to be added. </br>
* A station location map should be added. </br>
* Testing frontend.

## The data

The journey data is owned by City Bike Finland and can be found at HSL open data: https://www.hsl.fi/en/hsl/open-data </br>
The station data can be found at Avoin Data: https://www.avoindata.fi/data/en_GB/dataset/hsl-n-kaupunkipyoraasemat/resource/a23eef3a-cc40-4608-8aa2-c730d17e8902

