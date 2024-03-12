import loadJSON from './load-json.mjs';

const calculateProfit = async (latest, mapping, last24h) => {
    if(Object.keys(latest).length < 10){
        return [];
    }

    if(Object.keys(mapping).length < 10){
        return [];
    }

    const recipes = await loadJSON('https://jsonblob.com/api/jsonBlob/1216679464741494784');

    for(const recipe of recipes){
        let cost = 0;

        for(const input of recipe.input){
            if(!latest[input.id] || !latest[input.id].high){
                cost = cost + 999999999999999;

                continue;
            }

            cost = cost + latest[input.id].high;
        }

        recipe.name = mapping[recipe.resultItemId].name;
        recipe.cost = cost;
        recipe.reward = latest[recipe.resultItemId].low;
        recipe.profit = recipe.reward - recipe.cost;
        recipe.volume = (last24h[recipe.resultItemId]?.highPriceVolume + last24h[recipe.resultItemId]?.lowPriceVolume) || 0;
    }

    // for(const recipeOutputId in recipes){
    //     let cost = 0;
    //     for(const input of recipes[recipeOutputId].input){
    //         if(recipes[input]?.cost && recipes[input].cost < latest[input].high){
    //             cost = cost + recipes[input].cost;
    //         } else if(!latest[input] ){
    //             cost = cost + recipes[input].cost;
    //         } else {
    //             cost = cost + latest[input].high;
    //         }
    //     }

    //     if(cost === 0){
    //         continue;
    //     }

    //     recipes[recipeOutputId].cost = cost;
    //     recipes[recipeOutputId].reward = latest[recipeOutputId].low;
    //     recipes[recipeOutputId].profit = recipes[recipeOutputId].reward - recipes[recipeOutputId].cost;
    // }

    return recipes;
};

export default calculateProfit;