import * as runelite from 'runelite';

const useragent = "https://www.npmjs.com/package/runelite useragent/example";
// Ensure you're using a meaningful useragent to represent your use-case.

const mapping = await runelite.mapping({
    useragent,
});

export const searchForItem = (searchString) => {
    const matchingItems = [];
    for(const itemId in mapping){
        if(!mapping[itemId].name.toLowerCase().includes(searchString.toLowerCase())){
            continue;
        }

        matchingItems.push(mapping[itemId]);
    }

    return matchingItems;
};

export const getItem = (searchString) => {
    for(const itemId in mapping){
        if(mapping[itemId].name.toLowerCase() !== searchString.toLowerCase()){
            continue;
        }

        return mapping[itemId];
    }

    return false;
};

export default searchForItem;
