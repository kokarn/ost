import got from 'got';
import * as cheerio from 'cheerio';

import {getItem} from './modules/get-item.mjs';
import addRecipe from './modules/add-recipe.mjs';

const pageResponse = await got('https://oldschool.runescape.wiki/w/Jewellery');

const $ = cheerio.load(pageResponse.body);

const keys = [
    'image',
    'resultName',
    'level',
    'exp',
    'materials',
    'materialCost',
    'itemPrice',
    'profit/loss',
    'gp/hour',
    'xp/hour',
];

const crafts = [];
$('table').eq(1).find('tbody').find('tr').each((outerIndex, outerElement) => {
    const craft = {};

    $(outerElement).find('td').each((i, el) => {
        if($(el).find('br').length > 0) {
            craft[keys[i]] = [];

            $(el).find('a').each((itemIndex, itemElement) => {
                craft[keys[i]].push($(itemElement).text().trim());
            });

            craft[keys[i]] = craft[keys[i]].filter(Boolean);
        } else {
            const contents = $(el).text().trim();

            craft[keys[i]] = contents;
        }
    });

    crafts.push(craft);
});

for(const [index, craft] of crafts.entries()){
    if(!craft.resultName){
        crafts.splice(index, 1);

        continue;
    }

    craft.result = getItem(craft.resultName);
    craft.result = craft.result.id;

    if(Array.isArray(craft.materials)){
        craft.input = craft.materials.map(getItem);
    } else {
        craft.input = [getItem(craft.materials)];
    }

    craft.input = craft.input.map(item => item.id);
}

for(const craft of crafts){
    await addRecipe(craft);
};

// console.log(JSON.stringify(crafts, null, 4));