import {
    useEffect,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Skills from '../components/Skills.js';

import loadJSON from '../modules/load-json.mjs';
import calculateCombatLevel from '../modules/calculate-combat-level.mjs';

import '../App.css';

function Profile({filter}) {
    const [playerStats, setPlayerStats] = useState({});

    useEffect(() => {
        const loadInitialData = async () => {
            const mappingData = await loadJSON(`https://sync.runescape.wiki/runelite/player/superkokarn/STANDARD`);
            const gamePlayerStats = mappingData.levels;

            gamePlayerStats['Quests'] = mappingData.quests;
            gamePlayerStats['Achievement diaries'] = mappingData.achievement_diaries;

            gamePlayerStats['Quest points'] = 0;
            gamePlayerStats['Skills'] = 0;

            for(const skill in mappingData.levels){
                if(skill === 'Skills'){
                    continue;
                }

                gamePlayerStats['Skills'] = gamePlayerStats['Skills'] + mappingData.levels[skill];
            }

            for(const quest in mappingData.quests){
                gamePlayerStats['Quest points'] = gamePlayerStats['Quest points'] + mappingData.quests[quest];
            }

            gamePlayerStats['Combat level'] = calculateCombatLevel(gamePlayerStats);

            setPlayerStats(gamePlayerStats);
        }

        loadInitialData();
    }, []);

    return <Box
        component="form"
        noValidate
        autoComplete="off"
    >
        <Container>
            <Typography
                variant='h1'
            >
                {`Profile`}
            </Typography>
            <Skills
                skills = {playerStats}
            ></Skills>
            {/* <img
                alt = 'Skills tab'
                src = {`${process.env.PUBLIC_URL}/Skills_tab.png`}
            /> */}
        </Container>
    </Box>;
}

export default Profile;
