import readline from 'readline';
import {writeFile} from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import got from 'got';

const __dirname = dirname(fileURLToPath(import.meta.url));

let result = {};
let diaries = [
    'Ardougne',
    'Desert',
    'Falador',
    'Fremennik',
    'Kandarin',
    'Karamja',
    'Kourend',
    'Lumbridge',
    'Morytania',
    'Varrock',
    'Western',
    'Wilderness',
];
let diaryNameMap = {
    'Kourend': 'Kourend & Kebos',
    'Lumbridge': 'Lumbridge & Draynor',
    'Western': 'Western Provinces',
};
let quests = {};

const parseQuests = async () => {
    return new Promise((resolve, reject) => {
        const stream = got.stream(`https://cdn.jsdelivr.net/gh/runelite/runelite@master/runelite-api/src/main/java/net/runelite/api/Quest.java`);
        const rl = readline.createInterface({
            input: stream,
            output: process.stdout,
            terminal: false
        });

        rl.on('line', (line) => {
            const matches = line.match(/(?<key>[A-Z_]+)\((?<id>\d+), "(?<name>.+?)"\)/);
            if(matches && matches.groups.key) {
                quests[matches.groups.key] = {
                    name: matches.groups.name,
                    id: parseInt(matches.groups.id)
                };
            };
        });

        rl.on('close', () => {
            resolve();
        });
    });
}

const parseDiary = async (diary) => {
    return new Promise((resolve, reject) => {
        const stream = got.stream(`https://cdn.jsdelivr.net/gh/runelite/runelite@master/runelite-client/src/main/java/net/runelite/client/plugins/achievementdiary/diaries/${diary}DiaryRequirement.java`);
        const rl = readline.createInterface({
            input: stream,
            output: process.stdout,
            terminal: false
        });
        const key = diaryNameMap[diary] || diary;
        let currentSection = '';

        result[key] = {};

        rl.on('line', (line) => {
            try {
                if (line.includes('// EASY') || line.includes('//EASY')) {
                    currentSection = 'Easy';
                    result[key][currentSection] = {skills: {}, quests: []};
                } else if (line.includes('// MEDIUM') || line.includes('//MEDIUM')) {
                    currentSection = 'Medium';
                    result[key][currentSection] = {skills: {}, quests: []};
                } else if (line.includes('// HARD') || line.includes('//HARD')) {
                    currentSection = 'Hard';
                    result[key][currentSection] = {skills: {}, quests: []};
                } else if (line.includes('// ELITE') || line.includes('//ELITE')) {
                    currentSection = 'Elite';
                    result[key][currentSection] = {skills: {}, quests: []};
                }

                if (line.includes('SkillRequirement') && currentSection) {
                    let skill = line.split('Skill.')[1].split(',')[0].toLowerCase();
                    let level = parseInt(line.split('SkillRequirement(Skill.')[1].split(',')[1]);
                    if (result[key][currentSection].skills[skill]) {
                        if (level > result[key][currentSection].skills[skill]) {
                            result[key][currentSection].skills[skill] = level;
                        }
                    } else {
                        result[key][currentSection].skills[skill] = level;
                    }
                }

                if (line.includes('CombatLevelRequirement') && currentSection) {
                    let combatLevel = line.match(/CombatLevelRequirement\((\d+)\)/)[1];
                    result[key][currentSection].skills['combat level'] = combatLevel;
                }

                if (line.includes('QuestRequirement') && currentSection) {
                    let quest = line
                        .split('Quest.')[1]
                        .split(',')[0]
                        .replace('));', '')
                        .replace(')', '');

                    let status = line.includes('true') ? 1 : 2;

                    if (!result[key][currentSection].quests.some(q => q.name === quests[quest].name)) {
                        result[key][currentSection].quests.push({
                            name: quests[quest].name,
                            status
                        });
                    }
                }
            } catch (parseError) {
                console.error(parseError);

                reject(parseError);
            }
        });

        rl.on('close', () => {
            // console.log(JSON.stringify(result, null, 4));
            resolve();
        });
    })
};

console.time('diaries');
await parseQuests();
for (let diary of diaries) {
    console.log(`Parsing ${diary} diary...`);

    await parseDiary(diary);
}

writeFile(join(__dirname, '..', 'src', 'data', 'diaries.json'), JSON.stringify(result, null, 4));
console.timeEnd('diaries');