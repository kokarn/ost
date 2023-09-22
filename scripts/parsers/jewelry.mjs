import addRecipe from '../modules/add-recipe.mjs';
import getWikiTableCrafts from '../modules/get-wiki-table-crafts.mjs';

const keys = [
    'materials',
    'wikiCost',
    'wikiMaterialCost',
    'resultName',
    'wikiSell',
    'wikiProfit',
    'wikiXp',
    'wikiXp/hr',
    'wikiCoins/xp',
];

const urls = [
    'https://oldschool.runescape.wiki/w/Ruby',
    'https://oldschool.runescape.wiki/w/Diamond',
    'https://oldschool.runescape.wiki/w/Emerald',
    'https://oldschool.runescape.wiki/w/Sapphire',
    'https://oldschool.runescape.wiki/w/Opal',
    'https://oldschool.runescape.wiki/w/Jade',
    'https://oldschool.runescape.wiki/w/Red_topaz',
    'https://oldschool.runescape.wiki/w/Dragonstone',
];

for(const url of urls){
    let crafts;

    try {
        crafts = await getWikiTableCrafts(url, keys, false, 'unenchanted');
    } catch (error) {
        console.error(error);
    }

    // Add a cosmic rune
    for(const craft of crafts){
        if(!craft.input){
            continue;
        }

        craft.input.push(564);

        await addRecipe(craft);
    };

    // console.log(JSON.stringify(crafts, null, 4));
}