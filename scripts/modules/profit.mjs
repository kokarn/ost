import * as fs from 'node:fs/promises';

import * as runelite from 'runelite';
import got from 'got';

import { getLast24h } from './osrs-wiki-api.mjs';

const useragent = "https://www.npmjs.com/package/runelite useragent/example";
// Ensure you're using a meaningful useragent to represent your use-case.

const calculateProfit = async () => {
    console.time('calculateProfit');
    // const recipesData = await fs.readFile('./recipes.json', 'utf-8');
    // const recipes = JSON.parse(recipesData);

    const recipesResponse = await got('https://jsonblob.com/api/jsonBlob/1216679464741494784', {
        responseType: 'json',
    });

    const recipes = recipesResponse.body;

    const last24h = await getLast24h();
    // console.log(last24h);

    const mapping = await runelite.mapping({
        useragent,
    });

    const latest = await runelite.latest({
        useragent,
    });

    for(const recipeOutputId in recipes){
        let cost = 0;

        for(const input of recipes[recipeOutputId].input){
            cost = cost + latest[input].high;
        }

        recipes[recipeOutputId].name = mapping[recipeOutputId].name;
        recipes[recipeOutputId].cost = cost;
        recipes[recipeOutputId].reward = latest[recipeOutputId].low;
        recipes[recipeOutputId].profit = recipes[recipeOutputId].reward - recipes[recipeOutputId].cost;
        recipes[recipeOutputId].volume = (last24h[recipeOutputId]?.highPriceVolume + last24h[recipeOutputId]?.lowPriceVolume) || 0;
    }

    for(const recipeOutputId in recipes){
        let cost = 0;
        for(const input of recipes[recipeOutputId].input){
            if(recipes[input]?.cost && recipes[input].cost < latest[input].high){
                cost = cost + recipes[input].cost;
            } else {
                cost = cost + latest[input].high;
            }
        }

        if(cost === 0){
            continue;
        }

        recipes[recipeOutputId].cost = cost;
        recipes[recipeOutputId].reward = latest[recipeOutputId].low;
        recipes[recipeOutputId].profit = recipes[recipeOutputId].reward - recipes[recipeOutputId].cost;
    }

    // console.log(JSON.stringify(recipes, null, 2));

    fs.writeFile('../osrs-profit-ui/src/mapping.json', JSON.stringify(mapping, null, 2));
    fs.writeFile('../osrs-profit-ui/src/profits.json', JSON.stringify(recipes, null, 2));
    fs.writeFile('../osrs-profit-ui/src/latest.json', JSON.stringify(latest, null, 2));

    console.timeEnd('calculateProfit');
};

export default calculateProfit;