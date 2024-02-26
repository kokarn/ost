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

const parseQuests = async () => {
    return new Promise((resolve, reject) => {
        const stream = got.stream(`https://cdn.jsdelivr.net/gh/runelite/runelite@master/runelite-api/src/main/java/net/runelite/api/Quest.java`);
        const rl = readline.createInterface({
            input: stream,
            output: process.stdout,
            terminal: false
        });

        rl.on('line', (line) => {
            if (line.includes('public static final Quest')) {
                let quest = line.split('Quest.')[1].split(';')[0].replace(/_/g, ' ');
                console.log(quest);
            }
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
        const key = diary.toLowerCase();
        let currentSection = '';

        result[key] = {};

        rl.on('line', (line) => {
            try {
                if (line.includes('// EASY') || line.includes('//EASY')) {
                    currentSection = 'easy';
                    result[key][currentSection] = {skills: {}, quests: []};
                } else if (line.includes('// MEDIUM') || line.includes('//MEDIUM')) {
                    currentSection = 'medium';
                    result[key][currentSection] = {skills: {}, quests: []};
                } else if (line.includes('// HARD') || line.includes('//HARD')) {
                    currentSection = 'hard';
                    result[key][currentSection] = {skills: {}, quests: []};
                } else if (line.includes('// ELITE') || line.includes('//ELITE')) {
                    currentSection = 'elite';
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

                if (line.includes('QuestRequirement') && currentSection) {
                    let quest = line.split('Quest.')[1].split(',')[0].replace(/_/g, ' ').replace('));', '');
                    let status = line.includes('true') ? 'started' : 'completed';

                    if (!result[key][currentSection].quests.some(q => q.name === quest)) {
                        result[key][currentSection].quests.push({name: quest, status});
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
for (let diary of diaries) {
    console.log(`Parsing ${diary} diary...`);

    await parseDiary(diary);
}

writeFile(join(__dirname, '..', 'src', 'data', 'diaries.json'), JSON.stringify(result, null, 4));
console.timeEnd('diaries');