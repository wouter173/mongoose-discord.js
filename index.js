//require token
const token = require("./token.js")
//require packages
const mongoose = require('mongoose')
const discord = require("discord.js")

//require schema.js file voor mongoose
const settings = require('./schema.js')

//client setup voor discord.js
const client = new discord.Client()


//message event
client.on("message", msg => {

  //return als de msg author is een bot
  if (msg.author.bot) return

  //variables en args handler
  const prefix = "!"
  const args = msg.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  //help command
  //!help
  if (command == "help") {
    msg.channel.send("```help```\n**!save [name] [value]\n!find\n!delete\n!update [oldName] [newName]**")
  }


  //save command
  //!save [name] [value]
  if (command == "save") {

    //check of de args bestaan
    if (args[0] && args[1]) {

      //mongoose magie
      //hier word een nieuwe versie gemaakt van het settings model uit schema.js
      let temp = new settings()

      //hier wordden de variables van de nieuwe versie van het model aan een value gekoppelt
      temp.name = args[0]
      temp.value = args[1]

      //hier word de nieuwe versie van het model opgeslagen en zit deze meteen in je database
      temp.save()

      //discord.js
      msg.channel.send("saved")
    } else {
      //discord.js
      msg.channel.send("!save [name] [value]")
    }
  }


  //find command
  //!find
  if (command == "find") {

    //dit hier onder ziet er misschien raar uit want het is geen nieuwe versie van het settings model
    //maar dit is een directe link naar alle data van het settings model in je database
    //met settings.find() kan je alle settingss vinden door een query
    //hier is de query leeg: {} (dit is om alles te vinden)
    //maar het kan ook bijvoorbeeld {name: "hehe"} zijn om alle settings models die hehe heten te vinde ipv alles
    settings.find({}, (err, res) => {

      //err, res callback
      //res is het resultaat
      //print de res in chat
      msg.channel.send("```" + res + "```")
    })
  }


  //delete command
  //!delete 
  if (command == "delete") {

    //dit werkt hetzelfde als find alleen moet je bij delete 'deleteOne' of 'deleteMany' gebruiken
    settings.deleteMany({}, (err, res) => {

      //err, res callback
      //res is het resultaat
      //print res.deletedCount in chat
      msg.channel.send("```" + res.deletedCount + " deleted```")
    })
  }

  //update command
  //!update [oldName] [newName]
  if (command == "update") {
    if (args[0] && args[1]) {

      //dit werkt hetzelfde als delete alleen zijn er 2 objects die je moet parsen in de function
      //de eerste is een query om het oude model mee te vinde
      //in het 2de zitten de values die moeten wordden aangepast
      settings.updateMany({
        name: args[0]
      }, {
        name: args[1]
      }, (err, res) => {
        //err, res callback
        //res is het resultaat
        //print res.deletedCount in chat
        console.log(res)
        msg.channel.send("```" + res.nModified + " updated```")
      })
    } else {
      msg.channel.send("!update [oldName] [newName]")
    }
  }
})


//discord client login
client.login(token)

//mongoose database connection
//de 'useNewUrlParser' tag is voor good practice voor toekomstige updates enz
//de mongoose url is 'mongodb://[hostname]:[port]/[database]'
//de [database] is de database waar je de hele connectie lang mee werkt tenzij je een side connection opent
//als de database een naam heeft die nog niet bestaat maakt hij deze vanzelf aan
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true
})