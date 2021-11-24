const Discord = require('discord.js')
const config = require('./config.json')
const loadCommands = require('./Commands/load-commands')

const mongo = require('./util/mongo')

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', async() => {
    console.log('The bot is ready!')

    await mongo().then(mongoose => {
        try{
            console.log('Connected to mongo!')
        }finally{
        }
    })

    loadCommands(client)
})

client.login(config.token)
