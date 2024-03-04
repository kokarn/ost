import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import got from 'got';
import cheerio from 'cheerio';

import camelCase from './modules/camel-case.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url));

const data = JSON.parse(fs.readFileSync('data/mapping.json', 'utf8'));

const currentData = JSON.parse(fs.readFileSync(join(__dirname, '../src/data/item-properties-raw.json'), 'utf8'));

const updatedData = await got('https://raw.githubusercontent.com/0xNeffarion/osrsreboxed-db/master/docs/items-complete.json');
const itemData = JSON.parse(updatedData.body);

// let index = 1;
// for(const itemId in data){
//     console.log(`Loading item ${index} of ${Object.keys(data).length}`);
//     index = index + 1;

//     if(currentData[itemId]){
//         itemData[itemId] = currentData[itemId];
//         continue;
//     };

//     const url = `https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=${itemId}`;
//     const pageData = await got(url);

//     const $ = cheerio.load(pageData.body);

//     itemData[itemId] = {};

//     $('.infobox-item tr').each((i, el) => {
//         const key = $(el).find('th').eq(0).text().trim();
//         let value = $(el).find('td').eq(0).text().trim();

//         if(!key || !value) {
//             return true;
//         }

//         if(typeof value === 'string' && value.toLowerCase() === 'yes'){
//             value = true;
//         }

//         if(typeof value === 'string' && value.toLowerCase() === 'no'){
//             value = false;
//         }

//         itemData[itemId][camelCase(key)] = value;
//     });

//     fs.writeFileSync(join(__dirname, '..', 'src', 'data', 'item-properties-raw.json'), JSON.stringify(itemData, null, 4));
// }

let minimalItemData = {};

for(const itemId in itemData){
    minimalItemData[itemId] = {
        stackable: itemData[itemId].stackable,
    };
}

fs.writeFileSync(join(__dirname, '..', 'src', 'data', 'item-properties.json'), JSON.stringify(minimalItemData, null, 4));