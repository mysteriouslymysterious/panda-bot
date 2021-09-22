const { SlashCommandBuilder } = require('@discordjs/builders');
const puppeteer = require('puppeteer')
const { MessageAttachment, MessageEmbed } = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('cryptomap')
		.setDescription('Returns heatmap of crypto market from Coin360'),
	async execute(interaction) {


        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://coin360.com/?dependsOn=volume&exceptions=[USDT%2CBUSD]');


            await page.setViewport({
                width: 1920,
                height: 1080,
            });

            await page.waitForTimeout(5000);
            
            const element = await page.$('#app > section > section');
            
            if(element === null) {
                return interaction.reply('Element not loaded');
            }
    
            // use devtools and then choose copy selector for individual div you want to screenshot
            await element.screenshot({path: './assets/crypto_map.png'});
            

            await browser.close();
            
        })();
        
        const file = new MessageAttachment('./assets/crypto_map.png');

        await interaction.reply({ files: [file] });

	},
};