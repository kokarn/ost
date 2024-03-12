import loadJSON from "./load-json.mjs";

const addRecipe = async (recipe) => {
    const currentRecipes = await loadJSON('https://jsonblob.com/api/jsonBlob/1216679464741494784');

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

    currentRecipes.push(recipe);

    console.log(recipe);
    console.log(currentRecipes);

    await fetch('https://jsonblob.com/api/jsonBlob/1216679464741494784', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentRecipes),
    });

    return true;
};

export default addRecipe;