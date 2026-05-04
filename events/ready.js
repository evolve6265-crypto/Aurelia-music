const { REST, Routes } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`🧊 [Aurelia] Logged in as ${client.user.tag}`);

        const commands = client.commands.map(cmd => cmd.data.toJSON());
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        try {
            console.log('❄️ Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );
            console.log('❄️ Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    },

};
