import React, { useState } from "react";
import personService from "./services/persons";

const Notification = ({ message, type }) => {
  if (!message) return null;

  const notificationStyle = {
    color: type === "success" ? "green" : "red",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return <div style={notificationStyle}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({ message: null, type: "" });

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    // Frontend validation for name length
    if (newName.length < 3) {
      setNotification({
        message: "Name must be at least 3 characters long",
        type: "error",
      });
      setTimeout(() => setNotification({ message: null, type: "" }), 5000);
      return;
    }

    if (persons.some((person) => person.name === newName)) {
      setNotification({
        message: `${newName} is already added to phonebook`,
        type: "error",
      });
      setTimeout(() => setNotification({ message: null, type: "" }), 5000);
      return;
    }

    const newPerson = {
      id: persons.length + 1,
      name: newName,
      number: newNumber,
    };

    setPersons(persons.concat(newPerson));
    setNotification({ message: `Added ${newName}`, type: "success" });
    setTimeout(() => setNotification({ message: null, type: "" }), 5000);
    setNewName("");
    setNewNumber("");
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    const confirmDelete = window.confirm(`Delete ${person.name}?`);
    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setNotification({ message: `Deleted ${person.name}`, type: "success" });
          setTimeout(() => setNotification({ message: null, type: "" }), 5000);
        })
        .catch((error) => {
          setNotification({
            message: `Information of ${person.name} has already been removed from server`,
            type: "error",
          });
          setTimeout(() => setNotification({ message: null, type: "" }), 5000);
          setPersons(persons.filter((p) => p.id !== id)); // Remove from UI
        });
    }
  };

  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>
      <h3>add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h3>Numbers</h3>
      <ul>
        {personsToShow.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}{" "}
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
