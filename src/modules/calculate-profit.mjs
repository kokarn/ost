import loadJSON from './load-json.mjs';

const calculateProfit = async (latest, mapping, last24h) => {
    // console.log('calculating profit');
    if(Object.keys(latest).length < 10){
        return {};
    }

    if(Object.keys(mapping).length < 10){
        return {};
    }

    const recipes = await loadJSON('https://jsonblob.com/api/jsonBlob/1144240622516690944');
    // const recipes = recipesResponse.body;
    // const latestDataResponse = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/24h`);
    // const last24h = latestDataResponse.data;

    for(const recipeOutputId in recipes){
        let cost = 0;

        for(const input of recipes[recipeOutputId].input){
            if(!latest[input] || !latest[input].high){
                cost = cost + 999999999999999;

                continue;
            }

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
            } else if(!latest[input] ){
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

    return recipes;
};

export default calculateProfit;