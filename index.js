const Discord = require('discord.js')
const config = require('./config.json')
const loadCommands = require('./Commands/load-commands')
const loadFeatures = require('./Features/load-features')

const mongo = require('./util/mongo')

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

client.on('ready', async () => {
    console.log('The bot is ready!')

    await mongo().then(mongoose => {
        try {
            console.log('Connected to mongo!')
        } finally {
        }
    })

    loadCommands(client)
    loadFeatures(client)
})

client.on('messageCreate', (message) => {
    const prefix = config.prefix
    if(!message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if(!cmd)return
    if (cmd.inVoiceChannel && !message.member.voice.channel) return message.channel.send('You must be in a voice channel!')
    try{
        cmd.run(client, message, args)
    }catch (e){
        console.error(e)
        message.reply(`Error: ${e}`)
    }
})

module.exports = client

client.login(config.token)
