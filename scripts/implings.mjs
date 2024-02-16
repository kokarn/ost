import {writeFile} from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import got from 'got';
import * as cheerio from 'cheerio';

import parseWikiTable from './modules/parse-wiki-table.mjs';
import dropsToLoot from './modules/drops-to-loot.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const implings = [
    'https://oldschool.runescape.wiki/w/Dragon_impling',
    'https://oldschool.runescape.wiki/w/Crystal_impling',
    'https://oldschool.runescape.wiki/w/Lucky_impling',
    'https://oldschool.runescape.wiki/w/Magpie_impling',
    'https://oldschool.runescape.wiki/w/Ninja_impling',
    'https://oldschool.runescape.wiki/w/Nature_impling',
    'https://oldschool.runescape.wiki/w/Eclectic_impling',
    'https://oldschool.runescape.wiki/w/Earth_impling',
    'https://oldschool.runescape.wiki/w/Essence_impling',
    'https://oldschool.runescape.wiki/w/Gourmet_impling',
    'https://oldschool.runescape.wiki/w/Young_impling',
    'https://oldschool.runescape.wiki/w/Baby_impling',
];

const keys = [
    'icon',
    'item',
    'quantity',
    'rarity',
    'wikiPrice',
];

const implingDrops = [];

console.log('Loading impling data');
console.time('implings');

for(const impling of implings){
    const response = await got(impling);
    const $ = cheerio.load(response.body);
    let drops;

    try {
        drops = await parseWikiTable($, keys, false, 'item', false, 1);
    } catch (error) {
        console.error(error);
    }

    const totalLoot = dropsToLoot(drops);
    const name = $('#firstHeading').text();

    implingDrops.push({
        name,
        drops: totalLoot,
        link: impling,
    });
}

// console.log(JSON.stringify(implingDrops, null, 4));
writeFile(join(__dirname, '..', 'src', 'data', 'implings.json'), JSON.stringify(implingDrops, null, 4));
console.timeEnd('implings');