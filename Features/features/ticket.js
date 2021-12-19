const mongo = require('../../util/mongo')
const commands = require('../../util/commands')
const ticketSchema = require('../../Schemas/ticket-schema')
const Discord = require('discord.js')
const client = require('../../index')
const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = (client) => {
    const cache = {}

    commands(client, 'settickets', async (message) => {
        const { member, channel, content, guild } = message

        if (!member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            channel.send('You need the ADMINISTRATOR perms to use this command!')
            return
        }

        const prefix = require('../../config.json')
        const args = message.content.slice(prefix.length).split(/ +/)
        let text = content
        const split = text.split(' ')

        if (split.length < 2){
            channel.send('Please provide a custom ticket message!')
            return
        }

        split.shift()
        text = split.join(' ')
        cache[guild.id] = [channel.id, text]

        await mongo().then(async (mongoose) => {
            try{
                await ticketSchema.findByIdAndUpdate({
                    _id: guild.id
                }, {
                    _id: guild.id,
                    channelId: channel.id,
                    text
                }, {
                    upsert: true
                })
            }finally{
                let result = await ticketSchema.findOne({ _id: guild.id })
                const icon = message.guild.iconURL({ dynamic: true })
                const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('createticket')
                    .setLabel('Create Ticket')
                    .setStyle('PRIMARY')
                )
                const newEmbed = new Discord.MessageEmbed()
                .setTitle('V13 Tickets')
                .setThumbnail(icon)
                .setDescription(result.text)
                message.channel.send({ embeds: [newEmbed], components: [row] })
            }
        })
    })
}

client.on('interactionCreate', async (ButtonInteraction) => {
    if(!ButtonInteraction.isButton()) return
    const { guild, member } = ButtonInteraction
    if (ButtonInteraction.customId === 'createticket'){
        const deleteButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('delete')
            .setLabel('Delete')
            .setStyle('PRIMARY')
        )
        const sendEmbed = new Discord.MessageEmbed()
        .setTitle('Ticket information')
        .setDescription(`Thank you for creating a ticket ${ButtonInteraction.user.tag}`)

        const wait = require('util').promisify(setTimeout)
        await wait(1000)
        ButtonInteraction.guild.channels.create(`${ButtonInteraction.user.tag}`, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: ButtonInteraction.user.id,
                    allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                },
                {
                    id: ButtonInteraction.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                }
            ]
        })
        .then(channel => channel.send({ embeds: [sendEmbed], components: [deleteButton]})).catch((err) => {
            console.log(`Error: ${err}`)
        })

        const verificationEmbed = new Discord.MessageEmbed()
        .setTitle('Success')
        .setDescription(`Your ticket has been created at the top of the guild channels!`)
        ButtonInteraction.reply({ embeds: [verificationEmbed], ephemeral: true})
    }
    if(ButtonInteraction.customId === 'delete'){
        const error = new Discord.MessageEmbed()
        .setTitle('Permission Error')
        .setDescription('You need the MANAGE_CHANNELS perms to use this button!')
        if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)){
            ButtonInteraction.reply({ embeds: [error], ephemeral: true})
            return
        }
        ButtonInteraction.channel.delete('Ticket Closed')
    }
})
