import axios from 'axios'

const dbUrl = 'http://localhost:3001/persons'

const getPersons = () => {
  const request = axios.get(dbUrl)
  return request.then(response => response.data)
}

const createContact = newContact => {
  const request = axios.post(dbUrl, newContact)
  return request.then(response => response.data)
}

const del = id => {
  axios.delete(`${dbUrl}/${id}`)
}

const change = (id, newContact) => {
  const request = axios.put(`${dbUrl}/${id}`, newContact)
  return request.then(response => response.data)
}

export default { getPersons, createContact, del, change }