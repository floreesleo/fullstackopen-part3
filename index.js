const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const Person = require("./models/person");

const app = express();

// morgan.token("data", (req, res) => {
//   return JSON.stringify(req.body);
// });

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static("dist"));

// let persons = [];

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
  Person.find({})
    .then((persons) => response.json(persons))
    .catch((error) => response.status(500).json({ error: error }));
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((error) => response.status(404).json({ error: error }));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personDelete = persons.find((p) => p.id === id);

  if (!personDelete) {
    return response.status(404).json({ error: "Person not found" });
  }

  persons = persons.filter((p) => p.id !== id);

  response.status(200).json(personDelete).end();
});

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1_000_000);

  if (persons.some((person) => person.id === randomId)) {
    return generateId();
  }

  return randomId;
};

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  Person.findOne({ name: new RegExp(`^${name}$`, "i") }).then(
    (existinPerson) => {
      if (existinPerson) {
        return response.status(409).json({ error: "name must be unique" });
      }

      const newPerson = new Person({ name, number });

      return newPerson
        .save()
        .then((savedPerson) => response.status(201).json(savedPerson))
        .catch((error) => response.status(500).json({ error: error }));
    }
  );
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`EXPRESS SERVER RUNNING ON PORT: ${PORT}`);
});
