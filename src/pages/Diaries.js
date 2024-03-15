import {
    useMemo,
    useState,
    // useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import StickyTable from '../components/StickyTable.js';

// import numberFormat from '../modules/number-format.mjs';
// import loadJSON from '../modules/load-json.mjs';
// import calculateCombatLevel from '../modules/calculate-combat-level.mjs';
import ucFirst from '../modules/uc-first.mjs';

import diaryData from '../data/diaries.json';
import boostData from '../data/boosts.json';

import '../App.css';

function Diaries({filter, playerStats}) {
    const [hideCompleted, setHideCompleted] = useState(true);
    const [onlyCompletable, setOnlyCompletable] = useState(false);

    const rows = useMemo(() => {
        let returnRows = [];

        for (const diaryRegion in diaryData) {
            for(const difficulty in diaryData[diaryRegion]){
                if(playerStats['Achievement diaries'] && playerStats['Achievement diaries'][ucFirst(diaryRegion)][ucFirst(difficulty)].complete && hideCompleted){
                    continue;
                }

                if(filter && (!difficulty.toLowerCase().includes(filter.toLowerCase()) && !diaryRegion.toLowerCase().includes(filter.toLowerCase()))){
                    continue;
                }

                if(onlyCompletable && playerStats['Achievement diaries']){
                    let isCompletable = true;

                    // for(const quest of diaryData[diaryRegion][difficulty].quests){
                    //     if(playerStats['Quests'] && playerStats['Quests'][quest.name] < quest.status){
                    //         isCompletable = false;

                    //         break;
                    //     }
                    // }

                    for(const skill in diaryData[diaryRegion][difficulty].skills){
                        if((playerStats[ucFirst(skill)] + boostData[ucFirst(skill)]) < diaryData[diaryRegion][difficulty].skills[skill]){
                            isCompletable = false;
                            break;
                        }
                    }

                    // console.log(`${diaryRegion}-${difficulty}`, isCompletable, diaryData[diaryRegion][difficulty], playerStats)

                    if(!isCompletable){
                        continue;
                    }
                }

                returnRows.push({
                    id: `${diaryRegion}-${difficulty}`,
                    region: diaryRegion,
                    difficulty: difficulty,
                    ...diaryData[diaryRegion][difficulty],
                });
            }
        }

        returnRows = returnRows.filter((row) => {
            if(Object.keys(row.skills).length === 0 && hideCompleted){
                return false;
            }

            return true;
        });

        return returnRows;
    }, [playerStats, filter, hideCompleted, onlyCompletable]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            // width: 70,
        },
        {
            field: 'region',
            flex: 1,
            headerName: 'Diary',
            renderCell: ({row}) => {
                return <a
                    href={`https://oldschool.runescape.wiki/w/${encodeURIComponent(row.region.replace(/ /g, '_'))}_Diary#${row.difficulty}`}
                >
                    {row.region} - {row.difficulty}
                </a>;
            },
            minWidth: 200,
        },
        {
            field: 'quests',
            headerName: 'Quests',
            renderCell: ({row, value}) => {
                const questRequirements = [];
                for(const quest of value){
                    let isQualifiedClass = 'skill-not-ok';

                    if(playerStats.Quests && playerStats['Quests'][quest.name] >= quest.status){
                        isQualifiedClass = 'skill-ok';
                    }

                    questRequirements.push(<div
                        key={`${row.region}-${row.difficulty}-${quest.name}`}
                    >
                        <a
                            className={isQualifiedClass}
                            href={`https://oldschool.runescape.wiki/w/${encodeURI(quest.name.replace(/ /g, '_'))}`}
                        >
                            {quest.name}
                        </a>
                    </div>);
                };

                return <div>
                    {questRequirements}
                </div>;
            },
            width: 200,
        },
        {
            field: 'skills',
            headerName: 'Stats',
            renderCell: ({ value }) => {
                const skillRequirements = [];
                for(const skill in value){
                    let skillKey = ucFirst(skill);
                    let isQualifiedClass = 'skill-not-ok';
                    if(playerStats[skillKey] >= value[skill]){
                        isQualifiedClass = 'skill-ok';
                    } else if(playerStats[skillKey] + boostData[skillKey] >= value[skill]){
                        isQualifiedClass = 'skill-boost-ok';
                    }

                    let skillNote = '';

                    if(playerStats[skillKey] && isQualifiedClass !== 'skill-ok'){
                        skillNote = ` (${value[skill] - playerStats[skillKey]})`;
                    }

                    skillRequirements.push(<div
                        key={skill}
                    >
                        <span
                            className={isQualifiedClass}
                        >
                            {skillKey}: {value[skill]} {skillNote}
                        </span>
                    </div>);
                };

                return <div>
                    {skillRequirements}
                </div>;
            },
            width: 200,
        },
    ];

    const calculateRowHeight = (params) => {
        return (Object.keys(params.model.skills).length || 1) * 25 + (16 * params.densityFactor);
    };

    return <Box
        component="form"
        noValidate
        autoComplete="off"
    >
        <Container>
            <Typography
                variant='h1'
            >
                {`Diaries`}
            </Typography>
            <FormGroup>
                <Stack
                    direction="row"
                >
                    <FormControlLabel control={
                        <Checkbox
                            checked={hideCompleted}
                            label="Hide completed"
                            onChange={(event) => {
                                setHideCompleted(event.target.checked);
                            }}
                        />
                    } label="Hide completed" />
                    <FormControlLabel control={
                        <Checkbox
                            checked={onlyCompletable}
                            label="Only completable"
                            onChange={(event) => {
                                setOnlyCompletable(event.target.checked);
                            }}
                        />
                    } label="Show only completable" />
                </Stack>
            </FormGroup>
            <StickyTable
                density="standard"
                rows={rows}
                columns={columns}
                // getRowHeight={() => 'auto'}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                }}
                getRowHeight={calculateRowHeight}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                // hideFooter
                // slots={{ toolbar: CustomToolbar }}
            // slotProps={{
            //     toolbar: {
            //         showQuickFilter: true,
            //     },
            // }}
            />
        </Container>
    </Box>;
}

export default Diaries;
