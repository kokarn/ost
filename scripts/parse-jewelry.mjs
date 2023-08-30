import addRecipe from './modules/add-recipe.mjs';
import parseWikiTable from './modules/parse-wiki-table.mjs';

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

let crafts;

try {
    crafts = await parseWikiTable('https://oldschool.runescape.wiki/w/Diamond', keys, 7);
} catch (error) {
    console.error(error);
}

for(const craft of crafts){
    // Add a cosmic rune
    console.log(craft);
    craft.input.push(564);

    await addRecipe(craft);
};

console.log(JSON.stringify(crafts, null, 4));