const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { updateVolume } = require('../../utils/db');
const { useQueue } = require('discord-player');
const theme = require('../../utils/theme');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setvolume')
        .setDescription('Set the default server volume.')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Volume level (1-200)')
                .setMinValue(1)
                .setMaxValue(200)
                .setRequired(true)),

    async execute(interaction) {
        const volume = interaction.options.getInteger('amount');
        
        // Update Database
        await updateVolume(interaction.guild.id, volume);

        // Update live queue if playing
        const queue = useQueue(interaction.guild.id);
        if (queue) queue.node.setVolume(volume);

        const embed = new EmbedBuilder()
            .setColor(theme.colors.success)
            .setDescription(`🧊 **Server volume successfully set to \`${volume}%\`**`)
            .setFooter(theme.footer);

        await interaction.reply({ embeds: [embed] });
    }
  ,
};
