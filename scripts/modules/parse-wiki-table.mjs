import got from 'got';
import * as cheerio from 'cheerio';

import {getItem, searchForItem} from './get-item.mjs';

const parseWikiTable = async (url, keys, tableIndex) => {
    const pageResponse = await got(url);
    const $ = cheerio.load(pageResponse.body);

    const crafts = [];
    $('table').eq(tableIndex).find('tbody').find('tr').each((outerIndex, outerElement) => {
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

        console.log(craft.resultName);
        console.log(JSON.stringify(craft, null, 4));
        craft.result = getItem(craft.resultName);

        if(!craft.result){
            const searchResult = searchForItem(craft.resultName);

            if(searchResult.length > 1){
                console.log(`Found more than 1 item matching ${craft.resultName}`);

                continue;
            }

            if(searchResult.length === 0){
                console.log(`Could not find item for ${craft.resultName}`);

                continue;
            }

            craft.result = searchResult[0];
        }

        console.log(craft);

        craft.result = craft.result.id;

        if(Array.isArray(craft.materials)){
            craft.input = craft.materials.map(getItem);
        } else {
            craft.input = [getItem(craft.materials)];
        }

        craft.input = craft.input.map(item => item.id);
    }

    return crafts;
};

export default parseWikiTable;