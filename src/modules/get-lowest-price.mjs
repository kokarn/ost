import stores from '../data/stores.json';

const getLowestPrice = ({itemId, crafts, latest}) => {
    let lowestPrice = Infinity;
    let lowestPriceType = '';

    for(const storeItem of stores) {
        if(storeItem.id !== itemId) {
            continue;
        }

        if(storeItem.cost < lowestPrice) {
            lowestPrice = storeItem.cost;
            lowestPriceType = 'store';
        }
    }

    if(latest[itemId]?.low < lowestPrice){
        lowestPrice = latest[itemId].low;
        lowestPriceType = 'ge';
    }

    // for(const craft of crafts) {
    //     if(craft.resultItemId !== itemId) {
    //         continue;
    //     }

    //     if(craft.cost < lowestPrice) {
    //         lowestPrice = craft.cost;
    //         lowestPriceType = 'craft';
    //     }
    // }

    return {
        type: lowestPriceType,
        cost: lowestPrice,
    };
};

export default getLowestPrice;