const mongo = require('../../util/mongo')
const commands = require('../../util/commands')
const autoroleSchema = require('../../Schemas/autorole-schema')
const Discord = require('discord.js')
const client = require('../../index')
const { guilds } = require('../../index')

module.exports = (client) => {
    const cache = {}

    commands(client, 'setautorole', async (message) => {

        const { member } = message

        if (!member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            channel.send('You need the ADMINISTRATOR perms to use this command!')
            return
        }

        const prefix = require('../../config.json')
        const roles = message.mentions.roles.first()

        if(!roles){
            message.channel.send('No role has been mentioned!')
            return
        }

        await autoroleSchema.findByIdAndUpdate({
            _id: message.guild.id
        }, {
            _id: message.guild.id,
            roleId: roles.id
        }, {
            upsert: true
        })

        message.channel.send('The autorole has been set!')
       
    })
}

client.on('guildMemberAdd', async (member) => {
    const results = autoroleSchema.findOne({ _id: member.guild.id })

    if(!results){
        return
    }

    const role = results.roleId

    member.roles.add(role)
})