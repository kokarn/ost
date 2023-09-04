import addRecipe from '../modules/add-recipe.mjs';
import parseWikiTable from '../modules/parse-wiki-table.mjs';

const keys = [
    'level',
    '',
    'resultName',
    'wikiXp',
    '',
    'wikiMaterial1',
    '',
    'wikiMaterial2',
    '',
    'wikiMaterial3',
    'notes',
    // 'wikiXp/hr',
    // 'wikiCoins/xp',
];

const urls = [
    'https://oldschool.runescape.wiki/w/Herblore',
];

for(const url of urls){
    let crafts;

    try {
        crafts = await parseWikiTable(url, keys, false, 'level', '(3)');
    } catch (error) {
        console.error(error);
    }

    for(const craft of crafts){
        if(!craft.input){
            continue;
        }

        await addRecipe(craft);
    };

    console.log(JSON.stringify(crafts, null, 4));
}