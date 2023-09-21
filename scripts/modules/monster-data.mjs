import got from 'got';
import * as cheerio from 'cheerio';

import parseWikiTable from './parse-wiki-table-2.mjs';

const fractionToDecimal = (fractionString) => {
    // Split the string into numerator and denominator
    const [numerator, denominator] = fractionString.replace(',', '').split('/').map(Number);

    // Calculate the decimal representation
    const decimalValue = numerator / denominator;

    return decimalValue;
};

const parseInfoBox = ($) => {
    const infoBox = $('.infobox tr');

    const data = {};

    infoBox.each((index, element) => {
        const key = $(element).find('th').text().trim();
        const value = $(element).find('td').text().trim();

        data[key] = value;
    });

    return data;
};

const getMonsterData = async (url, keys) => {
    let drops;
    const returnData = {};

    const pageResponse = await got(url);
    const $ = cheerio.load(pageResponse.body);

    try {
        drops = await parseWikiTable($, keys, false, 'item', false, 1);
    } catch (error) {
        console.error(error);
    }

    const totalLoot = drops.map((drop) => {
        let multiplier = 1;

        if(!drop.rarity) {
            return false;
        }

        if(drop.item === 'Nothing'){
            return false;
        }

        drop.rarity = drop.rarity
            .replace(/\[d \d\]/g, '')
            .replace(/\[\d\]/g, '')
            .replace(/,/g, '')
            .replace('~', '');

        if(drop.rarity.includes('Always')){
            drop.rarity = '1/1';
        }

        if(drop.rarity.includes(';')){
            drop.rarity = drop.rarity.split(';')[0];
        }

        if(/\d ×/.test(drop.rarity)){
            const matches = drop.rarity.match(/(\d) ×/g);
            drop.rarity = drop.rarity.replace(/(\d) ×/g, '').trim();

            multiplier = Number(matches[0].replace('×', '').trim());
        }

        drop.quantity = drop.quantity
            .replace('(noted)', '')
            .replace(/,/g, '')
            .trim();

        if(drop.quantity.includes('–')){
            let [min, max] = drop.quantity.split('–');
            drop.quantity = Math.floor((Number(min) + Number(max)) / 2);
        }

        const quantity = fractionToDecimal(drop.rarity) * Number(drop.quantity) * multiplier;

        return {
            quantity,
            item: drop.item,
        };
    }).filter(Boolean);

    const infoBoxData = parseInfoBox($);

    returnData.combatLevel = Number(infoBoxData['Combat level']);

    if(infoBoxData['Slayer level'] && infoBoxData['Slayer level'] !== 'None'){
        returnData.slayerMonster = true;
        returnData.slayerLevel = Number(infoBoxData['Slayer level']);
    }

    returnData.drops = totalLoot;

    if(returnData.slayerMonster && !returnData.slayerLevel){
        console.log(url);
    }

    return returnData;
};

export default getMonsterData;