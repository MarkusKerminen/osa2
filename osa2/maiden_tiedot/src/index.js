import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import css from './index.css'

const App = () => {
   const [countries, setCountries] = useState([])
   const [filter, setFilter] = useState('')

   useEffect(() => {
      axios
         .get('https://restcountries.eu/rest/v2/all')
         .then(response => {
            setCountries(response.data)
         })
   }, [])

   const handleFilter = (event) => {
      setFilter(event.target.value)
   }

   return (
      <div>
         <p>find countries
            <input
               type='text'
               onChange={handleFilter}
               value={filter}
            />
         </p>
         <div>
            <Content
               countries={countries}
               filter={filter}
               setFilter={setFilter}
            />
         </div>
      </div>
   )
}

const Content = ({ countries, filter, setFilter }) => {
   const filteredCountries = countries
      .filter(country => country.name.toUpperCase().includes(filter.toUpperCase()))

   if (filteredCountries.length > 10) {
      return (
         <p>Too many matches, make the filter more specific</p>
      )
   } else if (filteredCountries.length > 1) {
      return (
         <div>
            {filteredCountries
               .map(country =>
                  <p key={country.name} >
                     {country.name}
                     < button onClick={() => setFilter(country.name)}>
                        show
                     </button>
                  </p >
               )
            }
         </div >
      )
   } else if (filteredCountries.length === 1) {
      return (
         <div>
            <Country country={filteredCountries[0]} />
         </div>
      )
   } else {
      return (
         <div>
            No matches
         </div>
      )
   }
}

const Country = ({ country }) => {
   const [weather, setWeather] = useState(false)

   useEffect(() => {
      axios
         .get(`http://api.apixu.com/v1/current.json?key=d4b0b2ed38a6475f93e122850190509&q=${country.capital}`)
         .then(response => {
            setWeather(response.data)
         })
   }, [])

   return (
      <div>
         <h2>{country.name}</h2>
         <p>
            capital {country.capital} <br />
            population {country.population}
         </p>

         <h3>languages</h3>
         <ul>
            {country.languages
               .map(language => <li key={language.name}>{language.name}</li>)}
         </ul>

         <img
            src={country.flag}
            alt={`flag of ${country.name}`}
         />

         <Weather weather={weather} />
      </div>
   )
}

const Weather = ({ weather }) => {
   console.log(weather)

   if (weather === false) {
      return (<p>Weather unavailable</p>)
   } else {
      return (
         <div>
            <h3>Weather in {weather.location.name}</h3>
            temperature: {weather.current.temp_c} &deg;C
            <br />
            <img
               src={weather.current.condition.icon}
               alt={weather.current.condition.text}
            />
            <br />
            wind: {weather.current.wind_kph} k/h direction {weather.current.wind_dir}
      </div>
      )
   }

}

ReactDOM.render(<App />, document.getElementById('root'))