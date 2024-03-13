const getCraftCost = (resultId, crafts, mapping) => {
    let itemCraft = crafts.find((craft) => craft.resultItemId.toString() === resultId.toString());

    let craftCost = itemCraft?.input.reduce((acc, input) => {
        return acc + mapping[input.id].lowestPrice.cost;
    }, 0);

    return craftCost;
};

export default getCraftCost;