const { MessageEmbed, Message, DiscordAPIError } = require('discord.js')
const suggestionsSchema = require('../../Schemas/suggestions-schema')

const statusMessages = {
    WAITING: {
        text: 'Waiting for feedback!',
        color: 0xffea00,
    },
    ACCEPTED: {
        text: 'This suggestion has been accepted!',
        color: 0x34eb5b,
    },
    DENIED: {
        text: 'This suggestion has been denied!',
        color: 0xc20808
    }
}

let suggestionCache = {}

const fetchSuggestionsChannels = async (guildId) => {
    let query = {}

    if (guildId){
        query._id = guildId
    }
    
    const results = await suggestionsSchema.find(query)

    for (const result of results){
        const { _id, channelId } = result
        suggestionCache[_id] = channelId
    }
}

module.exports = client => {
    fetchSuggestionsChannels()

    client.on('messageCreate', async (message) => {
        const { guild, channel, content, member } = message
        const cachedChannelId = suggestionCache[guild.id]

        if(cachedChannelId && cachedChannelId === channel.id && !member.user.bot){
            const status = statusMessages.WAITING

            if(!content) return

            const embed = new MessageEmbed()
            .setColor(status.color)
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setDescription(content)
            .addFields({
                name: 'Status',
                value: status.text
              })
            .setFooter('Want to suggest anything type it in this channel!')

            message.delete()

            channel.send({ embeds: [embed] })
            .then(async (embed) => {
                embed.react('👍')
                embed.react('👎')
            }).catch((err) => {
                console.log(err)
            })
        }
    })
}

module.exports.fetchSuggestionsChannels = fetchSuggestionsChannels

module.exports.statusMessages = statusMessages

module.exports.suggestionCache = () => {
    return suggestionCache
}