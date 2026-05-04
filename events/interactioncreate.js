const { useQueue } = require('discord-player');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '❌ There was an error executing this command!', ephemeral: true });
            }
        } 
        
        // Handle UI Buttons (Winter Monarch Theme UI)
        else if (interaction.isButton()) {
            const queue = useQueue(interaction.guild.id);
            if (!queue || !queue.isPlaying()) return interaction.reply({ content: '❌ No music is currently playing.', ephemeral: true });

            await interaction.deferUpdate();

            switch (interaction.customId) {
                case 'btn_play_pause':
                    queue.node.setPaused(!queue.node.isPaused());
                    break;
                case 'btn_skip':
                    queue.node.skip();
                    break;
                case 'btn_stop':
                    queue.delete();
                    break;
                case 'btn_shuffle':
                    queue.tracks.shuffle();
                    break;
                case 'btn_loop':
                    const repeatMode = queue.repeatMode === 0 ? 1 : queue.repeatMode === 1 ? 2 : 0;
                    queue.setRepeatMode(repeatMode);
                    break;
            }
        }
    },
  
};
