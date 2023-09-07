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
];

const keys = [
    'icon',
    'item',
    'quantity',
    'rarity',
    'wikiPrice',
    // 'wikiProfit',
    // 'wikiXp',
    // 'wikiXp/hr',
    // 'wikiCoins/xp',
];

let monsters = [];
let pageCache = [];

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

    // monsters = monsters
    //     .sort((a, b) => b.attributes.lootValue - a.attributes.lootValue)
    //     .filter((monster) => monster.attributes.lootValue > 0);

}

// console.log(JSON.stringify(monsters, null, 4));
writeFile(join(__dirname, '..', 'src', 'monsters.json'), JSON.stringify(monsters, null, 4));