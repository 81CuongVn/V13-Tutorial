const mongo = require('../../util/mongo')
const command = require('../../util/commands')
const ticketSchema = require('../../Schemas/ticket-schema')
const Discord = require('discord.js')
const client = require('../../index')

module.exports = (client) => {

  const cache = {}

  command(client, 'settickets', async (message) => {

    if (!message.guild.me.permissions.has("ADMINISTRATOR")) {
      message.channel.send('I need the ``ADMINISTRATOR`` permission to make the command run, make sure to check I have the permission, thanks!')
      return
    }

    const Discord = require('discord.js')
    const { MessageActionRow, MessageButton } = require('discord.js');

    const { member, channel, content, guild } = message

    if (!member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
      channel.send('You need ``ADMINISTRATOR`` permissions to run this command')
      return
    }

    const prefix = require('../../config.json')

    const args = message.content.slice(prefix.length).split(/ +/);

    let text = content

    const split = text.split(' ')

    if (split.length < 2) {
      channel.send('Please provide the custom ticket message!')
      return
    }

    split.shift()
    text = split.join(' ')
    cache[guild.id] = [channel.id, text]

    await mongo().then(async (mongoose) => {
      try {
        await ticketSchema.findOneAndUpdate({
          _id: guild.id,
        },
          {
            _id: guild.id,
            channelId: channel.id,
            text
          },
          {
            upsert: true,
          }
        )
      } finally {
        let result = await ticketSchema.findOne({ _id: guild.id })
        const icon = message.guild.iconURL({ dynamic: true })
        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('ticketcreate')
              .setLabel('Create Ticket')
              .setStyle('PRIMARY'),
          );
        const newEmbed = new Discord.MessageEmbed()
          .setTitle('Tickets')
          .setThumbnail(icon)
          .setDescription(result.text)
        message.channel.send({ embeds: [newEmbed], components: [row] })
      }
    })
  })
}

client.on('interactionCreate', async (ButtonInteraction) => {
  if (!ButtonInteraction.isButton()) return;
  const { MessageActionRow, MessageButton } = require('discord.js');
  if (ButtonInteraction.customId === 'ticketcreate') {
    const deleteButton = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('delete')
          .setLabel('Delete')
          .setStyle('PRIMARY'),
      );
    const sendEmbed = new Discord.MessageEmbed()
      .setColor('#384281')
      .setTitle('Ticket Information')
      .setDescription(`Thank you for creating a ticket!`)

    const wait = require('util').promisify(setTimeout);
    await wait(1000);
    const { guild, member } = ButtonInteraction
    ButtonInteraction.guild.channels.create(`${ButtonInteraction.user.tag}`, {
      type: "text",
      permissionOverwrites: [
        {
          id: ButtonInteraction.user.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        },
        {
          id: ButtonInteraction.guild.roles.everyone,
          deny: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
        }
      ],
    })
      .then(channel => channel.send({ embeds: [sendEmbed], components: [deleteButton] })).catch((err) => {
        console.log(`Error: ${err}`)
      });
    const modEmbed = new Discord.MessageEmbed()
      .setColor('#384281')
      .setTitle('Ticket Information')
      .setDescription('A ticket has been created so you can get help on what you need!')
    ButtonInteraction.reply({ embeds: [modEmbed], ephemeral: true });
  }
  if (ButtonInteraction.customId === 'delete') {
    const error = new Discord.MessageEmbed()
      .setColor('#384281')
      .setDescription('You need MANAGE_CHANNELS permissions to execute this button!')
    if (!ButtonInteraction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) {
      ButtonInteraction.reply({ embeds: [error], ephemeral: true })
      return
    }
    ButtonInteraction.channel.delete('Ticket closed')
  }
});
