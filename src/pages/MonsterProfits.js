import {
    useState,
    useMemo,
    useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import StickyTable from '../components/StickyTable';

import numberFormat from '../modules/number-format.mjs';
import loadJSON from '../modules/load-json.mjs';

import monsters from '../data/monsters.json';

import '../App.css';

function MonsterProfits({mapping, latest, filter}) {
    const [hideNonCombat, setHideNonCombat] = useState(true);
    const [playerStats, setPlayerStats] = useState({});
    const [hideUnqualified, setHideUnqualified] = useState(true);
    const [maxCombatLevel, setMaxCombatLevel] = useState(0);
    const [hideSuperior, setHideSuperior] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            const mappingData = await loadJSON(`https://sync.runescape.wiki/runelite/player/superkokarn/STANDARD`);
            const gamePlayerStats = mappingData.levels;
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

            setPlayerStats(gamePlayerStats);
        }

        loadInitialData();
    }, []);

    const rows = useMemo(() => {
        const itemMap = {};
        let monsterRows = [];

        for(const itemId in mapping){
            itemMap[mapping[itemId].name.toLowerCase()] = itemId;
        }

        // console.log(maxCombatLevel);

        for (const result of monsters) {
            const monsterData = {
                id: result.name,
                ...result,
            };

            let totalLootValue = 0;

            if(hideNonCombat && (monsterData.combatLevel === 0 || !monsterData.combatLevel)){
                // console.log(`Hiding ${monsterData.name} because it is not combat`);
                continue;
            }

            if(hideUnqualified && monsterData.slayerLevel > playerStats['Slayer']){
                continue;
            }

            if(maxCombatLevel && maxCombatLevel < monsterData.combatLevel){
                continue;
            }

            if(filter && monsterData.name.toLowerCase().indexOf(filter.toLowerCase()) === -1){
                continue;
            }

            if(hideSuperior && monsterData.superior){
                continue;
            }

            for(const drop of monsterData.drops){
                let item = latest[itemMap[drop.item.toLowerCase()]];

                if(!item && drop.item !== 'Coins'){
                    // console.log(`Could not find item for ${drop.item}`);

                    continue;
                }

                if(!drop.quantity){
                    // console.log(`Could not find quantity for ${drop.item}`);

                    continue;
                }

                if(drop.item === 'Coins'){
                    item = {
                        low: 1,
                    }
                }

                totalLootValue = totalLootValue + Math.floor(item.low * drop.quantity);

            }

            if(!totalLootValue){
                continue;
            }

            monsterData.lootValue = totalLootValue;
            monsterData.lootRatio = totalLootValue / monsterData.combatLevel;

            monsterRows.push(monsterData);
        }

        return monsterRows;
    }, [mapping, latest, hideNonCombat, hideUnqualified, maxCombatLevel, playerStats, filter, hideSuperior]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            // width: 70,
        },
        {
            field: 'name',
            flex: 1,
            headerName: 'Name',
            renderCell: ({row}) => {
                // console.log(row);
                return <a
                    href={row.link}
                >
                    {row.name}
                </a>;
            },
        },
        {
            field: 'lootValue',
            headerName: 'Avg. Loot',
            renderCell: ({ value }) => numberFormat(value),
            // width: 150,
        },
        {
            field: 'lootRatio',
            headerName: 'Loot ratio',
            renderCell: ({ value }) => numberFormat(value),
            // width: 150,
        },
        {
            field: 'combatLevel',
            headerName: 'Combat Level',
            renderCell: ({ value }) => numberFormat(value),
            // width: 150,
        },
        {
            field: 'slayerLevel',
            headerName: 'Slayer Level',
            renderCell: ({ value }) => numberFormat(value) || '',
            // width: 150,
        },
    ];

    return <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
    >
        <Container>
            <Typography
                variant='h1'
            >
                {`Monsters`}
            </Typography>
            <FormGroup>
                <Stack
                    direction="row"
                >
                    <FormControlLabel control={
                        <Checkbox
                            checked={hideNonCombat}
                            label="Hide non-combat things"
                            onChange={(event) => {
                                setHideNonCombat(event.target.checked);
                            }}
                        />
                    } label="Hide non-combat" />
                    <FormControlLabel control={
                        <Checkbox
                            checked={hideUnqualified}
                            label="Hide unqualified"
                            onChange={(event) => {
                                setHideUnqualified(event.target.checked);
                            }}
                        />
                    } label="Hide unqualified" />
                    <FormControlLabel control={
                        <Checkbox
                            checked={hideSuperior}
                            label="Hide superior"
                            onChange={(event) => {
                                setHideSuperior(event.target.checked);
                            }}
                        />
                    } label="Hide superior" />
                    <FormControlLabel control={
                        <TextField
                            label="Max combat level"
                            onChange={(event) => {
                                setMaxCombatLevel(event.target.value);
                            }}
                            type="number"
                        />
                    }/>
                </Stack>
            </FormGroup>
            <StickyTable
                density="standard"
                rows={rows}
                columns={columns}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                    sorting: {
                        sortModel: [{
                            field: 'lootRatio',
                            sort: 'desc',
                        }],
                    },
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
            />
        </Container>
    </Box>;
}

export default MonsterProfits;
