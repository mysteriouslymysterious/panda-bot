const { SlashCommandBuilder } = require('@discordjs/builders');
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
// const puppeteer = require('puppeteer-extra')
const puppeteer = require('puppeteer')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
// puppeteer.use(AdblockerPlugin({ blockTrackers: true })); // had to add semicolon or else the async function gets messed up 

const { MessageAttachment, MessageEmbed } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('getchart')
		.setDescription('Returns stock chart from TradingView')
        .addStringOption(option => option.setName('ticker').setDescription('Enter a ticker symbol').setRequired(true))
        .addStringOption(option => option.setName('interval').setDescription('Enter a time interval: 1, 5, 10, 15, 1h, 2h, 4h, D, M').setRequired(true))
        .addStringOption(option => option.setName('theme').setDescription('Optional, Set chart theme: light or dark')),
	async execute(interaction) {


        const ticker = interaction.options.getString('ticker').toUpperCase();
        let time_interval = interaction.options.getString('interval');
        const theme = interaction.options.getString('theme');

        let darkMode = true;


        if(theme === 'light'){
            darkMode = false;
        }

        // Allows for lower case d input
        if(time_interval === 'd') {
            time_interval = 'D';
        } else if (time_interval === '1h') {
            time_interval = '60';
        } else if (time_interval === '2h') {
            time_interval = '120';
        } else if (time_interval === '4h') {
            time_interval = '240';
        } else if (time_interval === '1m') {
            time_interval = '1';
        } else if (time_interval === '5m') {
            time_interval = '5';
        } else if (time_interval === '10m') {
            time_interval = '10';
        } else if (time_interval === '15m') {
            time_interval = '15';
        } else if (time_interval === 'm') {
            time_interval = 'M';
        }
        
        if(time_interval !== '1' && time_interval !== '5' && time_interval !== '10' && time_interval !== '15' && time_interval !== '60' && time_interval !== '120' && time_interval !== '240' && time_interval !== 'D' && time_interval !== 'M') {
            return interaction.reply('Please give time interval: (1, 5, 10, 15, 1h, 2h, 4h, D, M) ');
        }




        const url = `https://www.tradingview.com/chart/?symbol=${ticker}&interval=${time_interval}`;

        (async () => {

            await interaction.deferReply();

            const browser = await puppeteer.launch({
                headless: true,
              //args: ['--window-size=1920,1080'],
              //defaultViewport: null
                
            });

            const page = await browser.newPage();
            
            if(darkMode){
                // Create Dark Mode screenshot
                await page.emulateMediaFeatures([{
                    name: 'prefers-color-scheme', value: 'dark' }]);
            }

            await page.goto(url);

            await page.setViewport({
                width: 1920,
                height: 1080,
            });

            await page.waitForTimeout(2000);


            // TradingView Chart Area
            const element = await page.$('body > div.js-rootresizer__contents > div.layout__area--center');
    

            // use devtools and then choose copy selector for individual div you want to screenshot
            await element.screenshot({path: './assets/chart_tradingview.png'});
            
            // clip can control what part of page shows up as image
            /*
            await page.screenshot({ 
                'path': './assets/finviz_heatmap.png', 
                'clip': {x: 215, y: 0, width: 800, height: 800}
            });
            */

            //await page.resetPage();
            
            await browser.close();


            const file = new MessageAttachment('./assets/chart_tradingview.png');

            await interaction.editReply({ files: [file] });




        })();

        // const file = new MessageAttachment('./assets/chart_tradingview.png');
        
        
        // const exampleEmbed = new MessageEmbed()
        //     .setTitle('Some title')
        //     .setImage('attachment://discordjs.png');
        

		// await interaction.reply('finviz_heatmap.png');
		//await interaction.reply({ files: [file] });
		
	},
};