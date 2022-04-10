const suggestionsSchema = require('../../../Schemas/suggestions-schema')
const { fetchSuggestionsChannels } = require('../../../Features/features/suggestions')


module.exports = {
    commands: ['setsuggestions'],
    expectedArgs: '',
    permissionError: 'You do not have the correct permissions to run this command!',
    minArgs: 0,
    callback: async(message, arguments, client, args, cmd) => {
        const {member, guild} = message
        const {
            channel,
            guild: { id: guildId}
        } = message
        const {id: channelId} = channel

        await suggestionsSchema.findOneAndUpdate({
            _id: guildId
        }, {
            _id: guildId,
            channelId
        }, {
            upsert: true
        })

        message.channel.send(`The suggestions channel has been set to ${channel}!`).then((msg) => {

        }).catch((err) => {
            console.log(err)
        })

        fetchSuggestionsChannels(guildId)
    },
    permissions: 'SEND_MESSAGES',
    //requiredRoles: [],
}
