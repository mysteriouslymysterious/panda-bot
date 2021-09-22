const cooldown = new Set()

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {

		if(cooldown.has(interaction.member)){
			interaction.reply(`${interaction.member} you are on cooldown wait 10 seconds until new command`);
		} else {
			console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
		}
		cooldown.add(interaction.member);
		setTimeout(() => {
			cooldown.delete(interaction.member);
		}, 100);

	},
};