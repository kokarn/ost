import got from 'got';
import * as cheerio from 'cheerio';

import {getItem, searchForItem} from './get-item.mjs';

const parseWikiTable = async (url, keys, tableIndex = false, tableKey = false, nameSuffix = false, tableKeyIndex = 0, parseAsCraft = true) => {
    const pageResponse = await got(url);
    const $ = cheerio.load(pageResponse.body);

    const crafts = [];
    if(tableIndex){
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

            if(nameSuffix){
                craft.resultName = `${craft.resultName}${nameSuffix}`;
            }

            if(craft.wikiMaterial1 || craft.wikiMaterial2 || craft.wikiMaterial3){
                craft.materials = [];
                if(Array.isArray(craft.wikiMaterial1)){
                    craft.materials.concat(craft.wikiMaterial1);
                } else {
                    craft.materials.push(craft.wikiMaterial1);
                }

                if(Array.isArray(craft.wikiMaterial2)){
                    craft.materials.concat(craft.wikiMaterial2);
                } else {
                    craft.materials.push(craft.wikiMaterial2);
                }

                if(Array.isArray(craft.wikiMaterial3)){
                    craft.materials.concat(craft.wikiMaterial3);
                } else {
                    craft.materials.push(craft.wikiMaterial3);
                }
            }

            crafts.push(craft);
        });
    } else if(tableKey){
        $('table').each((index, tableElement) => {
            const firstColumnKey = $(tableElement).find('th').eq(tableKeyIndex).text().trim().toLowerCase();

            // console.log(firstColumnKey);

            if(firstColumnKey !== tableKey){
                return true;
            }

            $(tableElement).find('tbody').find('tr').each((outerIndex, outerElement) => {
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

                        // console.log(contents);

                        craft[keys[i]] = contents;
                    }
                });

                if(nameSuffix){
                    craft.resultName = `${craft.resultName}${nameSuffix}`;
                }

                if(craft.wikiMaterial1 || craft.wikiMaterial2 || craft.wikiMaterial3){
                    craft.materials = [];
                    if(Array.isArray(craft.wikiMaterial1)){
                        craft.materials.concat(craft.wikiMaterial1);
                    } else {
                        craft.materials.push(craft.wikiMaterial1);
                    }

                    if(Array.isArray(craft.wikiMaterial2)){
                        craft.materials.concat(craft.wikiMaterial2);
                    } else {
                        craft.materials.push(craft.wikiMaterial2);
                    }

                    if(Array.isArray(craft.wikiMaterial3)){
                        craft.materials.concat(craft.wikiMaterial3);
                    } else {
                        craft.materials.push(craft.wikiMaterial3);
                    }
                }

                crafts.push(craft);
            });
        });
    }


    if(!parseAsCraft){
        return crafts;
    }


    const returnCrafts = [];

    for(const craft of crafts){
        if(!craft.resultName){
            continue;
        }

        // console.log(craft);
        // console.log(JSON.stringify(craft, null, 4));
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

        craft.result = craft.result.id;

        if(Array.isArray(craft.materials)){
            craft.input = craft.materials.map(getItem);
        } else {
            craft.input = [getItem(craft.materials)];
        }

        craft.input = craft.input.map(item => item.id);

        returnCrafts.push(craft);
    }

    return returnCrafts;
};

export default parseWikiTable;