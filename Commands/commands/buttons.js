const { MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction } = require('discord.js')
const client = require('../../index')
module.exports = {
    commands: ['button'],
    expectedArgs: '',
    permissionError: 'You do not have the correct permissions to run this command!',
    minArgs: 0,
    callback: (message, arguments, client, args, cmd) => {

        const row1 = new MessageActionRow()
        .addComponents(
            //5 Buttons per row
            new MessageButton()
            .setCustomId('test')
            .setLabel('Button')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('text')
            .setLabel('Button2')
            .setStyle('SECONDARY')
        )

        const newEmbed = new MessageEmbed()
        .setDescription('Testing')

        message.channel.send({ embeds: [newEmbed], components: [row1]})
    },
    permissions: 'SEND_MESSAGES',
    //requiredRoles: [],
}

client.on('interactionCreate', async ButtonInteraction => {
    if(!ButtonInteraction.isButton()) return
    if (ButtonInteraction.customId === 'test') {
        const wait = require('util').promisify(setTimeout)
        await wait(1000) // Every 1000 ms = 1 second
        await ButtonInteraction.reply({ content: 'Working!' })
    }
    if (ButtonInteraction.customId === 'text'){
        const wait = require('util').promisify(setTimeout)
        await wait(1000) // Every 1000 ms = 1 second
        await ButtonInteraction.reply({ content: 'Texting!' })
    }
})