const craftsToNodes = (itemData, crafts, mapping) => {
    let nodes = [];
    let edges = [];
    let craftOffset = 0;

    if(itemData){
        nodes.push({
            id: itemData?.id.toString(),
            type: 'item',
            data: {
                label: mapping[itemData?.id]?.name,
                icon: mapping[itemData?.id]?.icon,
            },
            position: {
                x: 0,
                y: 0,
            },
            targetPosition: 'left',
            sourcePosition: 'right',
        })
    }

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
                    },
                    position: {
                        x: -150,
                        y: 25 * index + craftOffset,
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

            craftOffset = craftOffset + (index * 25);
            continue;
        }

        // If the item we are looking at is an input to the craft
        if(crafts[resultItemId].input.includes(itemData?.id)) {
            nodes.push({
                id: resultItemId,
                type: 'itemOutput',
                data: {
                    label: mapping[resultItemId].name,
                    icon: mapping[resultItemId].icon,
                },
                position: {
                    x: 100,
                    y: 0 + craftOffset,
                },
                targetPosition: 'left',
            });

            edges.push({
                id: `${itemData.id}-${resultItemId}`,
                source: itemData.id.toString(),
                target: resultItemId.toString(),
                animated: true,
            });

            let index = 0;
            for(const inputItemId of crafts[resultItemId].input) {
                if(inputItemId.toString() === itemData?.id.toString()) {
                    continue;
                }

                nodes.push({
                    id: inputItemId.toString(),
                    type: 'itemInput',
                    data: {
                        label: mapping[inputItemId].name,
                        icon: mapping[inputItemId].icon,
                    },
                    position: {
                        x: 0,
                        y: 25 * index + craftOffset,
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

            craftOffset = craftOffset + (index * 25);
        }
    }

    // console.log(nodes);
    // console.log(edges);

    return {
        nodes: nodes,
        edges: edges,
    }
};

export default craftsToNodes;