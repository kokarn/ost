const ITEM_HEIGHT = 35;

const craftsToNodes = (itemData, crafts, mapping, latest) => {
    let nodes = [];
    let edges = [];
    let recipes = [];

    if(itemData){
        nodes.push({
            id: itemData?.id.toString(),
            type: 'item',
            data: {
                label: mapping[itemData?.id]?.name,
                icon: mapping[itemData?.id]?.icon,
                price: latest[itemData?.id].low,
            },
            position: {
                x: 0,
                y: 0,
            },
            targetPosition: 'left',
            sourcePosition: 'right',
        })
    }

    let isSource = false;
    let isTarget = false;

    for(const resultItemId in crafts) {
        // If the result of the craft is the item we are looking at
        if(resultItemId.toString() === itemData?.id.toString()) {
            let index = 0;
            for(const inputItemId of crafts[resultItemId].input) {
                nodes.push({
                    id: inputItemId.toString(),
                    type: 'itemInput',
                    data: {
                        label: mapping[inputItemId].name,
                        icon: mapping[inputItemId].icon,
                        price: latest[inputItemId].low,
                    },
                    position: {
                        x: -150,
                        y: ITEM_HEIGHT * index,
                    },
                    sourcePosition: 'right',
                });

                edges.push({
                    id: `${inputItemId}-${resultItemId}`,
                    source: inputItemId.toString(),
                    target: resultItemId.toString(),
                    animated: true,
                });

                index = index + 1;
            }

            isTarget = true;
            continue;
        }

        // If the item we are looking at is an input to the craft
        if(crafts[resultItemId].input.includes(itemData?.id)) {
            let recipeNodes = [];
            let recipeEdges = [];

            isSource = true;
            recipeNodes.push({
                id: resultItemId,
                type: 'itemOutput',
                data: {
                    label: mapping[resultItemId].name,
                    icon: mapping[resultItemId].icon,
                    price: latest[resultItemId].low,
                },
                position: {
                    x: 100,
                    y: 0,
                },
                targetPosition: 'left',
            });

            recipeEdges.push({
                id: `${itemData.id}-${resultItemId}`,
                source: itemData.id.toString(),
                target: resultItemId.toString(),
                animated: true,
            });

            let index = 1;
            for(const inputItemId of crafts[resultItemId].input) {
                if(inputItemId.toString() === itemData?.id.toString()) {
                    continue;
                }

                recipeNodes.push({
                    id: inputItemId.toString(),
                    type: 'itemInput',
                    data: {
                        label: mapping[inputItemId].name,
                        icon: mapping[inputItemId].icon,
                        price: latest[inputItemId].low,
                    },
                    position: {
                        x: 0,
                        y: ITEM_HEIGHT * index,
                    },
                    sourcePosition: 'right',
                });

                recipeEdges.push({
                    id: `${inputItemId}-${resultItemId}`,
                    source: inputItemId.toString(),
                    target: resultItemId.toString(),
                    animated: true,
                });

                index = index + 1;
            }

            recipes[resultItemId] = {
                nodes: recipeNodes,
                edges: recipeEdges,
            };
        }
    }

    if(!isSource && nodes[0]) {
        nodes[0].type = 'itemOutput';
    }

    if(!isTarget && nodes[0]) {
        nodes[0].type = 'itemInput';
    }

    return {
        nodes: nodes,
        edges: edges,
        recipes: recipes,
    }
};

export default craftsToNodes;