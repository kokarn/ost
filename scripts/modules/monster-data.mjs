import got from 'got';
import * as cheerio from 'cheerio';

import parseWikiTable from './parse-wiki-table.mjs';
import dropsToLoot from './drops-to-loot.mjs';

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

    const totalLoot = dropsToLoot(drops);

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

    returnData.superior = false;

    return returnData;
};

export default getMonsterData;