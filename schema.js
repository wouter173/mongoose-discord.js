//require mongoose voor het schema en model variable
const mongoose = require("mongoose")
//schema variable 
const Schema = mongoose.Schema

//hier word een nieuwe schema gemaakt
const schema = new Schema({

  //id is een non-required variable van het type String
  id: String,

  //name is ook een required variable van het type String
  //als er het name object niet is gedefined voor het saven van een model van dit schema
  //dan word er een error gethrowt en word het model niet opgeslagen in de database
  name: {
    type: String,
    required: true
  },

  //value is een non-required variable van het type String met een default value van "!"
  value: {
    type: String,
    default: "!"
  }
})

const Guild = mongoose.model("guilds", schema)

module.exports = Guild