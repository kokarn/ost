import {writeFile} from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import got from 'got';
import * as cheerio from 'cheerio';

import getMonsterData from './modules/monster-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const categories = [
    'https://oldschool.runescape.wiki/w/Category:Dragons',
    'https://oldschool.runescape.wiki/w/Category:Demons',
    'https://oldschool.runescape.wiki/w/Category:Trolls',
    'https://oldschool.runescape.wiki/w/Category:Rare_drop_table_monsters',
    'https://oldschool.runescape.wiki/w/Category:Pages_with_drop_log-supported_drop_tables?pageuntil=Imre#mw-pages',
    'https://oldschool.runescape.wiki/w/Category:Pages_with_drop_log-supported_drop_tables?pagefrom=Imre#mw-pages',
    'https://oldschool.runescape.wiki/w/Category:Slayer_monsters',
    'https://oldschool.runescape.wiki/w/Category:Slayer_monsters?pagefrom=Greater+Skeleton+Hellhound+%28Calvar%27ion%29#mw-pages',
    'https://oldschool.runescape.wiki/w/Category:Slayer_monsters?pagefrom=Sea+Snake+Hatchling#mw-pages',
];

const keys = [
    'icon',
    'item',
    'quantity',
    'rarity',
    'wikiPrice',
];

let monsters = [];
let pageCache = [];

console.log('Loading monster data');
console.time('monsters');

for(const category of categories){
    const response = await got(category);
    const $ = cheerio.load(response.body);

    const monsterPromises = [];

    $('.mw-category a').each((i, el) => {
        let url = `https://oldschool.runescape.wiki${$(el).attr('href')}`;

        if(pageCache.includes(url)){
            return;
        }

        pageCache.push(url);

        if(url.toLowerCase().includes('bloodthirsty')){
            return;
        }

        monsterPromises.push(async () => {
            const value = await getMonsterData(url, keys);
            const name = $(el).attr('title');

            return {
                name: name,
                link: url,
                ...value,
            };
        });
    });

    monsters = monsters.concat(await Promise.all(monsterPromises.map((monsterPromise) => monsterPromise())));

}

// console.log(JSON.stringify(monsters, null, 4));
writeFile(join(__dirname, '..', 'src', 'data', 'monsters.json'), JSON.stringify(monsters, null, 4));
console.timeEnd('monsters');