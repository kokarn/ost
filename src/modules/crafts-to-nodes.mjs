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

    for(const craft of crafts) {
        // If the result of the craft is the item we are looking at
        if(craft.resultItemId.toString() === itemData?.id.toString()) {
            let index = 0;
            for(const input of craft.input) {
                nodes.push({
                    id: input.id.toString(),
                    type: 'itemInput',
                    data: {
                        label: mapping[input.id].name,
                        icon: mapping[input.id].icon,
                        price: latest[input.id].low,
                    },
                    position: {
                        x: -150,
                        y: ITEM_HEIGHT * index,
                    },
                    sourcePosition: 'right',
                });

                edges.push({
                    id: `${input.id}-${craft.resultItemId}`,
                    source: input.id.toString(),
                    target: craft.resultItemId.toString(),
                    animated: true,
                });

                index = index + 1;
            }

            isTarget = true;
            // continue;
        }

        // If the item we are looking at is an input to the craft
        if(craft.input.find((input) => input.id.toString() === itemData?.id.toString())) {
            let recipeNodes = [];
            let recipeEdges = [];

            isSource = true;
            recipeNodes.push({
                id: craft.resultItemId,
                type: 'itemOutput',
                data: {
                    label: mapping[craft.resultItemId].name,
                    icon: mapping[craft.resultItemId].icon,
                    price: latest[craft.resultItemId].low,
                },
                position: {
                    x: 100,
                    y: 0,
                },
                targetPosition: 'left',
            });

            recipeEdges.push({
                id: `${itemData.id}-${craft.resultItemId}`,
                source: itemData.id.toString(),
                target: craft.resultItemId.toString(),
                animated: true,
            });

            let index = 1;
            for(const input of craft.input) {
                if(input.id.toString() === itemData?.id.toString()) {
                    continue;
                }

                recipeNodes.push({
                    id: input.id.toString(),
                    type: 'itemInput',
                    data: {
                        label: mapping[input.id].name,
                        icon: mapping[input.id].icon,
                        price: latest[input.id].low,
                    },
                    position: {
                        x: 0,
                        y: ITEM_HEIGHT * index,
                    },
                    sourcePosition: 'right',
                });

                recipeEdges.push({
                    id: `${input.id}-${craft.resultItemId}`,
                    source: input.id.toString(),
                    target: craft.resultItemId.toString(),
                    animated: true,
                });

                index = index + 1;
            }

            recipes[craft.resultItemId] = {
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

    // console.log(nodes, edges, recipes);

    return {
        nodes: nodes,
        edges: edges,
        recipes: recipes,
    }
};

export default craftsToNodes;