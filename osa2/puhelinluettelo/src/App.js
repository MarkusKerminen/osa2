import React, { useState, useEffect } from 'react'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personsService
      .getPersons()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const counter = (accumulator, value) => accumulator + 1;
    const ifHas = persons
      .map(person => person.name)
      .filter(name => name === newName)
      .reduce(counter, 0)

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    if (ifHas === 0) {
      personsService.createContact(newPerson)
        .then(newP => {
          setPersons(persons.concat(newP))
          setNewName('')
          setNewNumber('')
        })
      setNotification(`Added ${newPerson.name}`)
      setTimeout(() => { setNotification(null) }, 4000)
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const id = persons.find(person => person.name === newPerson.name).id
        var success = true
        personsService.change(id, newPerson)
          .then(returnedPerson => setPersons(persons.map(person => person.id !== id ? person : returnedPerson)))
          .catch(error => {
            success = false
            setNotification(`${newPerson.name} has already been removed from the server`)
            setTimeout(() => { setNotification(null) }, 4000)
            setPersons(persons.filter(p => p.id !== id))
          })
        setNewName('')
        setNewNumber('')
        if (success) {
          setNotification(`Changed the number for ${newPerson.name}`)
          setTimeout(() => { setNotification(null) }, 4000)
        }
      }
    }
  }

  const deleteContact = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      personsService.del(person.id)
      setPersons(persons.filter(p => p !== person))
      setNotification(`Deleted ${person.name}`)
      setTimeout(() => { setNotification(null) }, 4000)
    }
  }

  const handleInpChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handleInpChangeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification} />
      <p>Filter shown <input
        value={filter}
        onChange={handleFilterChange}
      /></p>

      <h2>Add a new contact</h2>
      <PersonForm
        handleInpChangeName={handleInpChangeName}
        handleInpChangeNumber={handleInpChangeNumber}
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
      />

      <h2>Contacts</h2>
      <Persons persons={persons} filter={filter} deleteContact={deleteContact} />
    </div >
  )
}

const Persons = ({ persons, filter, deleteContact }) => (
  <div>
    {persons
      .filter(person => person.name.toUpperCase().includes(filter.toUpperCase()) || filter.length === 0)
      .map(person => <Person person={person} key={person.name} deleteContact={deleteContact} />)}
  </div>
)

const Person = ({ person, deleteContact }) => (
  <div>
    {person.name} {person.number + " "}
    <button onClick={() => deleteContact(person)}>delete</button>
  </div>
)

const PersonForm = ({ handleInpChangeName, newName, handleInpChangeNumber, newNumber, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input
        value={newName}
        onChange={handleInpChangeName}
      />
    </div>
    <div>
      number: <input
        value={newNumber}
        onChange={handleInpChangeNumber}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

export default App