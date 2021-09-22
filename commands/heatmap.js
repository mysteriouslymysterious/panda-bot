const { SlashCommandBuilder } = require('@discordjs/builders');
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({ blockTrackers: true })); // had to add semicolon or else the async function gets messed up 

const { MessageAttachment, MessageEmbed } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('heatmap')
		.setDescription('Returns heatmap of stock market from FinViz'),
	async execute(interaction) {

        (async () => {
            const browser = await puppeteer.launch({
              //headless: false,
              //args: ['--window-size=1920,1080'],
              //defaultViewport: null
                
            });
            const page = await browser.newPage();
            //await page.goto('https://www.tradingview.com/chart/?symbol=tsla&interval=60&width=400&container_id=tradingview_e6bca');
            await page.goto('https://finviz.com/map.ashx');
            //await page.goto('https://www.tradingview.com/heatmap/crypto/');

            /*
            await page.setViewport({
                width: 1200,
                height: 800,
            });
            */

            await page.setViewport({
                width: 1920,
                height: 1080,
            });

            await page.waitForTimeout(2000);

            // FinViz heatmap
            const element = await page.$('#body > div > div:nth-child(1) > canvas.hover-canvas');
            //const element = await page.$('body > div.tv-main > div.tv-content > div.js-market-heatmap.market-heatmap-wrapper.market-heatmap-wrapper--loaded > div > div:nth-child(2) > div.canvasContainer-Vlhzv2Ir');
    
            //await page.setViewport()

            // use devtools and then choose copy selector for individual div you want to screenshot
            await element.screenshot({path: './assets/finviz_heatmap.png'});
            
            // clip can control what part of page shows up as image
            /*
            await page.screenshot({ 
                'path': './assets/finviz_heatmap.png', 
                'clip': {x: 215, y: 0, width: 800, height: 800}
            });
            */

            await page.resetPage();
            
            await browser.close();
        })();

        const file = new MessageAttachment('./assets/finviz_heatmap.png')
        file.height = 400;
        file.width = 400;
        
        // const exampleEmbed = new MessageEmbed()
        //     .setTitle('Some title')
        //     .setImage('attachment://discordjs.png');
        

		// await interaction.reply('finviz_heatmap.png');
		await interaction.reply({ files: [file] });
	},
};