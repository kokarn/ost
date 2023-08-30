import * as cheerio from 'cheerio';
import got from 'got';

// import {getItem, searchForItem} from './get-item.mjs';

const parseWikiTable = async (url, keys, tableIndex) => {
    const pageResponse = await got(url);
    const $ = cheerio.load(pageResponse.body);

    const rows = [];
    $('table').eq(tableIndex).find('tbody').find('tr').each((outerIndex, rowElement) => {
        const craft = {};

        $(rowElement).find('td').each((i, el) => {
            switch(i){
                case 0:
                    craft[keys[i]] = $(el).find('a').text().trim();
                    craft[keys[i + 1]] = $(el).find('a').attr('href').trim();
                    break;

                case 1:
                    craft[keys[i + 1]] = Number($(el).text().trim().replace(/,/g, ''));
                    break;

                case 2:
                    const skills = {};
                    $(el).find('[data-skill]').each((skillIndex, skillElement) => {
                        const skillValue = $(skillElement)
                            .text()
                            .replace('+', '')
                            .replace(' Recommended', '')
                            .replace('Combat level', '')
                            .replace('Total level', '')
                            .replace('Quest points', '')
                            .trim();

                        if(!skills[$(skillElement).attr('data-skill')]){
                            skills[$(skillElement).attr('data-skill')] = skillValue;
                        }
                    });
                    craft[keys[i + 1]] = skills;
                    break;

                default:
                    craft[keys[i + 1]] = $(el).text().trim();
                    break;
            }
        });

        if(craft.methodName){
            rows.push(craft);
        }
    });

    for(const row of rows){
        const rawSkills = row.skills;
        const parsedSkills = {};

        // console.log(rawSkills);

        for(const skill in rawSkills){
            if(skill === 'Combat level'){
                parsedSkills.Attack = rawSkills[skill];
                parsedSkills.Defence = rawSkills[skill];
                parsedSkills.Strength = rawSkills[skill];

                continue;
            }

            // Remove anything that just says "Decent"
            if(rawSkills[skill].includes('Decent')){
                continue;
            }

            if(rawSkills[skill].includes('Iban')){
                console.log(rawSkills[skill]);
            }

            if(rawSkills[skill].includes('/')){
                const [min, ...max] = rawSkills[skill].split('/');

                parsedSkills[skill] = min;
                continue;
            }

            if(rawSkills[skill].includes(',')){
                const [min, ...max] = rawSkills[skill].split(',');

                parsedSkills[skill] = min;
                continue;
            }

            if(rawSkills[skill].includes('or')){
                const [min, ...max] = rawSkills[skill].split('or');

                parsedSkills[skill] = min;
                continue;
            }

            parsedSkills[skill] = rawSkills[skill];
        }

        row.skills = parsedSkills;
        // console.log(row.skills);
    }


    return rows;
};


const keys = [
    'methodName',
    'methodLink',
    'hourlyProfit',
    'skills',
    'category',
    'itenstity',
    'random',
];

let methods;

try {
    methods = await parseWikiTable('https://oldschool.runescape.wiki/w/Money_making_guide', keys, 0);
} catch (error) {
    console.error(error);
}

// for(const craft of crafts){
//     // Add a cosmic rune
//     console.log(craft);
//     craft.input.push(564);

//     await addRecipe(craft);
// };

console.log(JSON.stringify(methods, null, 4));