const suggestionsSchema = require('../../../Schemas/suggestions-schema')
const { fetchSuggestionsChannels, statusMessages, suggestionCache } = require('../../../Features/features/suggestions')
const { MessageEmbed } = require('discord.js')


module.exports = {
    commands: ['suggestions'],
    expectedArgs: '',
    permissionError: 'You do not have the correct permissions to run this command!',
    minArgs: 0,
    callback: async (message, arguments, client, args, cmd) => {
        const { member } = message

        if (!args[0]) {
            return message.channel.send('Please say the message ID!')
        }

        if (!args[1]) {
            return message.channel.send('Please say the new status!')
        }

        const { guild } = message

        const messageId = args.shift()
        const status = args.shift().toUpperCase()
        const reason = args.join(' ')

        const newStatus = statusMessages[status]

        if (!newStatus) {
            message.reply(`Unkown status "${status}", please use ${Object.keys(statusMessages)}`)
            return
        }

        const channelId = suggestionCache()[guild.id]
        if (!channelId) {
            message.reply('A error occurred, please report this!')
            return
        }

        const channel = guild.channels.cache.get(channelId)
        if (!channel) {
            message.reply('The suggestions channel no longer exists!')
            return
        }

        const targetMessage = await channel.messages.fetch(messageId, false, true).catch((err) => {
        });
        if (!targetMessage) {
            message.reply('That message is not a suggestion!')
            return
        }

        const oldEmbed = targetMessage.embeds[0]
        const embed = new MessageEmbed()
            .setColor(newStatus.color)
            .setAuthor(oldEmbed.author.name, oldEmbed.author.iconURL())
            .setDescription(oldEmbed.description)
            .setFooter('Want to suggest anything type it in this channel!')

        if (oldEmbed.fields.length === 2) {
            embed.addFields(oldEmbed.fields[0], {
                name: 'Status',
                value: `${newStatus.text}${reason ? ` Reason: ${reason} ` : ''}`
            })
        } else {
            embed.addFields({
                name: 'Status',
                value: `${newStatus.text}${reason ? ` Reason: ${reason} ` : ''}`
            })
        }

        targetMessage.edit({ embeds: [embed] })
    },
    permissions: 'SEND_MESSAGES',
    //requiredRoles: [],
}