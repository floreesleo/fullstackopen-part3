const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGOOSE_URI;

console.log("Connecting to ", url);

mongoose
  .connect(url)
  .then((result) => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.error("Error connecting to MongoDB: ", error.message)
  );

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
  },
  number: {
    type: String,
    required: [true, "Number is required"],
    minlength: [8, "Number must be at least 8 characters long"],
    maxlength: [15, "Number must be at most 15 characters long"],
    validate: {
      validator: (value) => {
        return /\d{2,3}-\d{6,}/.test(value); // XX-XXXXXXX or XXX-XXXXXXX
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
