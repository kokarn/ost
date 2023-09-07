import got from 'got';
import * as cheerio from 'cheerio';

import parseWikiTable from './parse-wiki-table-2.mjs';

const fractionToDecimal = (fractionString) => {
    // Split the string into numerator and denominator
    const [numerator, denominator] = fractionString.replace(',', '').split('/').map(Number);

    // Calculate the decimal representation
    const decimalValue = numerator / denominator;

    // Convert to percentage
    // const percentageValue = decimalValue * 100;

    return decimalValue;
};

const getMonsterData = async (url, keys) => {
    let drops;

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

            // console.log(matches);

            multiplier = Number(matches[0].replace('×', '').trim());
        }

        // if(multiplier !== 1){
        //     console.log(multiplier);
        //     console.log(drop);
        // }

        drop.quantity = drop.quantity
            .replace('(noted)', '')
            .replace(/,/g, '')
            .trim();

        if(drop.quantity.includes('–')){
            let [min, max] = drop.quantity.split('–');
            drop.quantity = Math.floor((Number(min) + Number(max)) / 2);
        }

        // drop.rarity = drop.rarity.replace('Always', '1/1');
        const quantity = fractionToDecimal(drop.rarity) * Number(drop.quantity) * multiplier;
        // const price = Number(drop.wikiPrice.replace(/,/g, ''));

        return {
            quantity,
            item: drop.item,
        };
    }).filter(Boolean);

    // console.log(JSON.stringify(drops, null, 4));
    // console.log(JSON.stringify(totalLoot, null, 4));

    // let totalLootValue = 0;

    // for(const drop of totalLoot){
    //     let item = await getItem(drop.item);

    //     if(!item && drop.item !== 'Coins'){
    //         // console.log(`Could not find item for ${drop.item}`);

    //         continue;
    //     }

    //     if(!drop.quantity){
    //         // console.log(`Could not find quantity for ${drop.item}`);

    //         continue;
    //     }

    //     if(drop.item === 'Coins'){
    //         item = {
    //             low: 1,
    //         }
    //     }

    //     totalLootValue = totalLootValue + (item.low * drop.quantity);
    // }

    let combatLevel = Number($('.infobox tr').eq(6).find('td').eq(0).text().trim());

    if(!combatLevel){
        combatLevel = Number($('.infobox tr').eq(7).find('td').eq(0).text().trim());
    }

    const returnData = {
        drops: totalLoot,
        combatLevel: combatLevel,
    };

    return returnData;
};

export default getMonsterData;