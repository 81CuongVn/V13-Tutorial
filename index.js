const Discord = require('discord.js')
const config = require('./config.json')
const loadCommands = require('./Commands/load-commands')

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('The bot is ready!')

    loadCommands(client)
})

client.login(config.token)
