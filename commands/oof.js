const { SlashCommandBuilder } = require('@discordjs/builders');

const cooldown = new Set()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('oof')
		.setDescription('Returns oof gif'),
	async execute(interaction) {

		if(cooldown.has(interaction.member)){
			interaction.reply(`${interaction.member} you are on cooldown wait 10 seconds until new command`);
		} else {
			await interaction.reply('https://c.tenor.com/Z9O6sGo6wCcAAAAd/oof-old-man.gif');

		}
		cooldown.add(interaction.member);
		setTimeout(() => {
			cooldown.delete(interaction.member);
		}, 10000);

	},
};