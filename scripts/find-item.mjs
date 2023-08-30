import * as runelite from 'runelite';

const useragent = "https://www.npmjs.com/package/runelite useragent/example";
// Ensure you're using a meaningful useragent to represent your use-case.

const mapping = await runelite.mapping({
    useragent,
});

const searchString = process.argv[2];

for(const itemId in mapping){
    if(!mapping[itemId].name.toLowerCase().includes(searchString.toLowerCase())){
        continue;
    }

    console.log(mapping[itemId]);
}