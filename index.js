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

app.get("/", (request, response) => {
  response.send("<h1>Hello Fullstack Open</h1>");
});

app.get("/info", (request, response, next) => {
  const currentDate = new Date();

  Person.find({})
    .then((persons) => {
      response.send(`<div>
        <p>Phonebook has info for ${persons.length} ${
        persons.length === 1 ? "person" : "people"
      }</p>
        <p>${currentDate}</p>
      </div>`);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => response.json(persons))
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1_000_000);

  if (persons.some((person) => person.id === randomId)) {
    return generateId();
  }

  return randomId;
};

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  if (!name) return response.status(400).json({ error: "name is missing" });
  if (!number) return response.status(400).json({ error: "number is missing" });

  const newPerson = new Person({ name, number });

  return newPerson
    .save()
    .then((savedPerson) => response.status(201).json(savedPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  const updatedPerson = { name: name, number: number };

  Person.findByIdAndUpdate(request.params.id, updatedPerson, {
    new: true,
  })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`EXPRESS SERVER RUNNING ON PORT: ${PORT}`);
});
