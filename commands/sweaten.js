const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sweaten')
		.setDescription('Returns sweaten gif'),
	async execute(interaction) {
		await interaction.reply('https://i.gifer.com/7GAP.gif');
	},
};