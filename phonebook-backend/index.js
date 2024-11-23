const express = require("express");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello Fullstack Open</h1>");
});

app.get("/info", (request, response) => {
  const currentDate = new Date();

  response.send(
    `<div>
      <p>Phonebook has info for ${persons.length} ${
      persons.length === 1 ? "person" : "people"
    }</p>
    <p>${currentDate}</p>
    </div>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((n) => n.id === id);

  if (!person) {
    response.status(404).send("<h1>Person not found</h1>").end();
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const newPersons = persons.filter((p) => p.id !== id);

  // response.status(204).end();
  response.json(newPersons).status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express server running: http://localhost:${PORT}`);
});
