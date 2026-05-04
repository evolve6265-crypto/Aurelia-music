const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { useQueue } = require('discord-player');
const theme = require('../../utils/theme');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Displays the currently playing track and controls.'),

    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: '❌ No music is currently playing.', ephemeral: true });
        }

        const track = queue.currentTrack;
        const progress = queue.node.createProgressBar();

        const embed = new EmbedBuilder()
            .setColor(theme.colors.primary)
            .setAuthor({ name: 'Now Playing', iconURL: 'https://i.imgur.com/your_ice_crystal_icon.png' })
            .setTitle(`**${track.title}**`)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .setDescription(`${progress}\n\nRequested by: ${track.requestedBy}`)
            .setFooter(theme.footer);

        // Winter Monarch Interactive Buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_play_pause').setEmoji(theme.emojis.play).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_skip').setEmoji(theme.emojis.skip).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_stop').setEmoji(theme.emojis.stop).setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('btn_loop').setEmoji(theme.emojis.loop).setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_shuffle').setEmoji(theme.emojis.shuffle).setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    
    },
};
