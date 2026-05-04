const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const theme = require('../../utils/theme');
const { getGuildSettings } = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or playlist from YouTube or Spotify.')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('The song name or URL')
                .setRequired(true)),
                
    async execute(interaction) {
        await interaction.deferReply();
        const player = useMainPlayer();
        const query = interaction.options.getString('query');
        const channel = interaction.member.voice.channel;

        if (!channel) return interaction.followUp('❌ You are not connected to a voice channel!');

        const settings = await getGuildSettings(interaction.guild.id);

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction,
                    volume: settings.volume,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 300000,
                    leaveOnEnd: false
                }
            });

            const embed = new EmbedBuilder()
                .setColor(theme.colors.primary)
                .setAuthor({ name: 'Added to Queue', iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`**[${track.title}](${track.url})**`)
                .setThumbnail(track.thumbnail)
                .addFields(
                    { name: 'Duration', value: track.duration, inline: true },
                    { name: 'Author', value: track.author, inline: true }
                )
                .setFooter(theme.footer);

            return interaction.followUp({ embeds: [embed] });
        } catch (e) {
            console.error(e);
            return interaction.followUp(`❌ Something went wrong while trying to play: \`${query}\``);
        }
    
    },
};
