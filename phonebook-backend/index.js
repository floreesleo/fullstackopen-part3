const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = 3001;

app.use(morgan("tiny"));
app.use(express.json());

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

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1_000_000);

  if (persons.some((person) => person.id === randomId)) {
    return generateId();
  }

  return randomId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  if (persons.some((p) => p.name.toLowerCase() === person.name.toLowerCase())) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

  persons = persons.concat(person);
  response.json(person);
});

app.listen(PORT, () => {
  console.log(`Express server running: http://localhost:${PORT}`);
});
