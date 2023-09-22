const fractionToDecimal = (fractionString) => {
    // Split the string into numerator and denominator
    const [numerator, denominator] = fractionString.replace(',', '').split('/').map(Number);

    // Calculate the decimal representation
    const decimalValue = numerator / denominator;

    return decimalValue;
};


const dropsToLoot = (drops) => {
    return drops.map((drop) => {
        let multiplier = 1;

        if(!drop.rarity) {
            return false;
        }

        if(drop.item === 'Nothing'){
            return false;
        }

        drop.rarity = drop.rarity
            .replace(/\[d \d\]/g, '')
            .replace(/\[\d\]/g, '')
            .replace(/,/g, '')
            .replace('~', '');

        if(drop.rarity.includes('Always')){
            drop.rarity = '1/1';
        }

        if(drop.rarity.includes(';')){
            drop.rarity = drop.rarity.split(';')[0];
        }

        if(/\d ×/.test(drop.rarity)){
            const matches = drop.rarity.match(/(\d) ×/g);
            drop.rarity = drop.rarity.replace(/(\d) ×/g, '').trim();

            multiplier = Number(matches[0].replace('×', '').trim());
        }

        drop.quantity = drop.quantity
            .replace('(noted)', '')
            .replace(/,/g, '')
            .trim();

        if(drop.quantity.includes('–')){
            let [min, max] = drop.quantity.split('–');
            drop.quantity = Math.floor((Number(min) + Number(max)) / 2);
        }

        const quantity = fractionToDecimal(drop.rarity) * Number(drop.quantity) * multiplier;

        return {
            quantity,
            item: drop.item,
        };
    }).filter(Boolean);
};

export default dropsToLoot;