const { SlashCommandBuilder } = require('@discordjs/builders');
const Scraper = require("images-scraper");
const { MessageAttachment, MessageEmbed } = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('grabimage')
		.setDescription('Returns an image from Google based on inputted search term')
        .addStringOption(option => option.setName('input').setDescription('Enter a string')),
	async execute(interaction) {
        
        const image_query = interaction.options.getString('input');
        if(!image_query) return interaction.reply('Please give a word as input');

        const google = new Scraper({
            puppeteer: {
                headless: true,
                //executablePath: '/usr/bin/chromium-browser',
            },
        });

        //await interaction.deferReply();


        (async () => {

            await interaction.deferReply();

            const randomIntNum = Math.floor(Math.random() * 5);

            console.log(randomIntNum);

            // Grabs five links
            const image_results = await google.scrape(image_query, 5);
            
            //console.log("results", image_results[0]);
            // Actual URL
            console.log("URL results", typeof(image_results[randomIntNum].url));

            //await google.waitForTimeout(5000);


            //await interaction.reply(image_results[0].url);
            //await interaction.reply('https://cdn.mos.cms.futurecdn.net/42E9as7NaTaAi4A6JcuFwG-1200-80.jpg');

            await interaction.editReply(image_results[randomIntNum].url);

            //await interaction.reply('https://cdn.mos.cms.futurecdn.net/42E9as7NaTaAi4A6JcuFwG-1200-80.jpg');

        })();

        

        //console.log(image_results['url'])

        //await interaction.reply(`temp stuff`);

        /*

        (async () => {
            const results = await google.scrape("banana", 200);
            console.log("results", results);
        })();


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
                return 
            }
    
            // use devtools and then choose copy selector for individual div you want to screenshot
            await element.screenshot({path: './assets/crypto_map.png'});
            

            await browser.close();
        })();

        const file = new MessageAttachment('./assets/crypto_map.png')

        */
        
        //await interaction.reply(image_results[0].url);
        //await interaction.editReply(image_results[0].url);
        

        //await interaction.reply(`\"${interaction.options.getString('input')}\" was inputed`);
        
        

	},
};