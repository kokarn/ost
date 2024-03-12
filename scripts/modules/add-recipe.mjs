import * as fs from 'node:fs/promises';

import got from 'got';

const addRecipe = async (recipe) => {
    const recipesResponse = await got('https://jsonblob.com/api/jsonBlob/1216679464741494784', {
        responseType: 'json',
    });

    const currentRecipes = recipesResponse.body;

    // if(currentRecipes[recipe.result]){
    //     console.error(`Recipe for ${recipe.result} already exists`);

    //     return false;
    // }

    if(recipe.input.length < 1){
        console.error(`Can't add a recipe without any inputs`);

        return false;
    }

    // for(const inputId of recipe.input){
    //     if(inputId === null){
    //         console.error(`Can't add a recipe with a null input`);

    //         return false;
    //     }
    // }

    console.log(`Adding recipe for ${recipe.result}`);

    currentRecipes[recipe.result] = {
        input: recipe.input,
    };

    await fs.writeFile('./recipes.json', JSON.stringify(currentRecipes, null, 2));
    await got('https://jsonblob.com/api/jsonBlob/1216679464741494784', {
        method: 'PUT',
        body: JSON.stringify(currentRecipes),
    });

    return true;
};

export default addRecipe;