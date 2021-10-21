module.exports = {
    commands: ['ping', 'pings'],
    expectedArgs: '',
    permissionError: 'You do not have the correct permissions to run this command!',
    minArgs: 0,
    callback: (message, arguments, client, args, cmd) => {
        message.channel.send('Pong!')
    },
    permissions: 'SEND_MESSAGES',
    //requiredRoles: [],
}
