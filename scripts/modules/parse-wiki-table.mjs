const parseRow = ($, outerElement, keys, crafts, nameSuffix) => {
    const craft = {};

    $(outerElement).find('td').each((i, el) => {
        if($(el).find('br').length > 0) {
            craft[keys[i]] = [];

            $(el).find('a').each((itemIndex, itemElement) => {
                craft[keys[i]].push($(itemElement).text().trim());
            });

            craft[keys[i]] = craft[keys[i]].filter(Boolean);
        } else {
            const contents = $(el).text().trim();

            craft[keys[i]] = contents;
        }
    });

    if(nameSuffix){
        craft.resultName = `${craft.resultName}${nameSuffix}`;
    }

    if(craft.wikiMaterial1 || craft.wikiMaterial2 || craft.wikiMaterial3){
        craft.materials = [];
        if(Array.isArray(craft.wikiMaterial1)){
            craft.materials.concat(craft.wikiMaterial1);
        } else {
            craft.materials.push(craft.wikiMaterial1);
        }

        if(Array.isArray(craft.wikiMaterial2)){
            craft.materials.concat(craft.wikiMaterial2);
        } else {
            craft.materials.push(craft.wikiMaterial2);
        }

        if(Array.isArray(craft.wikiMaterial3)){
            craft.materials.concat(craft.wikiMaterial3);
        } else {
            craft.materials.push(craft.wikiMaterial3);
        }
    }

    crafts.push(craft);
}

const parseWikiTable = async ($, keys, tableIndex = false, tableKey = false, nameSuffix = false, tableKeyIndex = 0) => {
    const crafts = [];
    if(typeof tableIndex === 'number'){
        $('table').eq(tableIndex).find('tbody').find('tr').each((outerIndex, outerElement) => {
            parseRow($, outerElement, keys, crafts, nameSuffix);
        });
    } else if(tableKey){
        $('table').each((index, tableElement) => {
            const firstColumnKey = $(tableElement).find('th').eq(tableKeyIndex).text().trim().toLowerCase();

            if(firstColumnKey !== tableKey){
                return true;
            }

            $(tableElement).find('tbody').find('tr').each((outerIndex, outerElement) => {
                parseRow($, outerElement, keys, crafts, nameSuffix);
            });
        });
    }

    return crafts;
};

export default parseWikiTable;