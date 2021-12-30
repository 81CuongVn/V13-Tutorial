const Discord = require('discord.js')
const { MessageActionRow, MessageButton } = require('discord.js')
const client = require('../../index')

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('Info')
            .setLabel('Information')
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('cmd')
            .setLabel('Commands')
            .setStyle('PRIMARY')
    )

module.exports = {
    commands: ['help'],
    expectedArgs: '',
    permissionError: 'You do not have the correct permissions to run this command!',
    minArgs: 0,
    callback: (message, arguments, client, args, cmd) => {
        const newEmbed = new Discord.MessageEmbed()
            .setTitle('Help menu')
            .setFooter(`${message.author.tag} requested the help menu!`)
            .setTimestamp()
            .setDescription('This is the help menu, select a button below for that category!')

        message.channel.send({ embeds: [newEmbed], components: [row] })
    },
    permissions: 'SEND_MESSAGES',
    //requiredRoles: [],
}

client.on('interactionCreate', async (ButtonInteraction) => {
    if (!ButtonInteraction.isButton()) return
    const newEmbed = new Discord.MessageEmbed()
        .setTitle('Help menu')
        .setFooter(`${ButtonInteraction.user.tag} requested the help menu!`)
        .setTimestamp()
        .setDescription('This is the help menu, select a button below for that category!')

    if (ButtonInteraction.customId === 'Info') {
        const infoEmbed = new Discord.MessageEmbed()
            .setTitle('Information')
            .setTimestamp()
            .setFooter('Here is the information of the bot!')
            .setDescription('This bot is for V13 tutorial')

        const wait = require('util').promisify(setTimeout)
        await wait(1000)
        ButtonInteraction.reply({ embeds: [infoEmbed], ephemeral: true })
    }
    if (ButtonInteraction.customId === 'cmd') {
        const infoEmbed = new Discord.MessageEmbed()
            .setTitle('Commands')
            .setTimestamp()
            .setFooter('Here is the commands of the bot!')
            .setDescription(';buttons (this is a working buttons system!)\n\n;ping (shows the bot is up and running)\n\n;help (shows all the commands)')

        const wait = require('util').promisify(setTimeout)
        await wait(1000)
        ButtonInteraction.reply({ embeds: [infoEmbed], ephemeral: true })
    }
})