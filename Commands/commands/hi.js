module.exports = {
    commands: ['hi'],
    expectedArgs: '',
    permissionError: 'You do not have the correct permissions to run this command!',
    minArgs: 0,
    callback: (message, arguments, client, args, cmd) => {
        const options = [
            "Hello",
            "Hi",
            "How are you",
            "Hello, how are you?"
        ]
        
        const random = options[Math.floor(Math.random() * options.length)]

        message.reply(`${random}`)
    },
    permissions: 'SEND_MESSAGES',
    //requiredRoles: [],
}