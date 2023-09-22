import got from 'got';
import * as cheerio from 'cheerio';

import {getItem, searchForItem} from './get-item.mjs';
import parseWikiTable from './parse-wiki-table.mjs';

const getWikiTableCrafts = async (url, keys, tableIndex = false, tableKey = false, nameSuffix = false, tableKeyIndex = 0, parseAsCraft = true) => {
    const pageResponse = await got(url);
    const $ = cheerio.load(pageResponse.body);

    const crafts = parseWikiTable($, keys, tableIndex, tableKey, nameSuffix, tableKeyIndex);

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

export default getWikiTableCrafts;