import {
    useMemo,
    useState,
    useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Stack } from '@mui/material';

import numberFormat from '../modules/number-format.mjs';
import loadJSON from '../modules/load-json.mjs';
import calculateCombatLevel from '../modules/calculate-combat-level.mjs';

import moneyMaking from '../money-making.json';

import '../App.css';

const CustomToolbar = () => {
    return (
        <GridToolbarContainer>
            {/* Include the quick filter input */}
            <GridToolbarQuickFilter />

            {/* Add any other desired toolbar components */}
        </GridToolbarContainer>
    );
};

function MoneyMaking() {
    const [playerStats, setPlayerStats] = useState({});
    const [hideEmpty, setHideEmpty] = useState(true);
    const [hideUnqualified, setHideUnqualified] = useState(true);

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

            gamePlayerStats['Combat level'] = calculateCombatLevel(gamePlayerStats);

            // console.log(gamePlayerStats['Combat level']);

            setPlayerStats(gamePlayerStats);
        }

        loadInitialData();
    }, []);

    const rows = useMemo(() => {
        let returnRows = [];

        for (const result of moneyMaking) {
            returnRows.push({
                id: result.methodName,
                ...result,
            });
        }

        returnRows = returnRows.filter((row) => {
            if(Object.keys(row.skills).length === 0 && hideEmpty){
                return false;
            }

            for (const skill in row.skills) {
                if (playerStats[skill] < row.skills[skill] && hideUnqualified) {
                    return false;
                }
            }

            return true;
        });

        return returnRows;
    }, [playerStats, hideEmpty, hideUnqualified]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            // width: 70,
        },
        {
            field: 'methodName',
            flex: 1,
            headerName: 'Name',
            renderCell: ({ value }) => {
                const itemData = rows.find((row) => row.methodName === value);
                return <a
                    href={`https://oldschool.runescape.wiki${itemData?.methodLink}`}
                >
                    {value}
                </a>;
            },
        },
        {
            field: 'hourlyProfit',
            headerName: 'Profit / Hour',
            renderCell: ({ value }) => numberFormat(value),
            // width: 200,
            // renderCell: ({ value }) => {
            //     const itemComponents = value.map((itemId) => {
            //         return <div
            //             key={itemId}
            //         >
            //             {mapping[itemId]?.name}: {numberFormat(Math.min(latest[itemId]?.low, (profits[itemId]?.cost || 9999999)))}
            //         </div>;
            //     });

            //     return <div>
            //         {itemComponents}
            //     </div>;
            // },
        },
        {
            field: 'skills',
            headerName: 'Skills',
            renderCell: ({ value }) => {
                const skillRequirements = [];
                for(const skill in value){
                    skillRequirements.push(<div
                        key={skill}
                    >
                        {skill}: {value[skill]}
                    </div>);
                };

                return <div>
                    {skillRequirements}
                </div>;
            },
            width: 200,
        },
        // {
        //     field: 'reward',
        //     headerName: 'Reward',
        //     valueFormatter: ({ value }) => numberFormat(value),
        //     width: 120,
        // },
        // {
        //     field: 'profit',
        //     headerName: 'Profit',
        //     valueFormatter: ({ value }) => numberFormat(value),
        //     width: 120,
        // },
    ];

    const calculateRowHeight = (params) => {
        return (Object.keys(params.model.skills).length || 1) * 20 + (16 * params.densityFactor);
    };

    return <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
    >
        <Container>
            <FormGroup>
                <Stack
                    direction="row"
                >
                    <FormControlLabel control={
                        <Checkbox
                            checked={hideEmpty}
                            label="Hide empty requirements"
                            onChange={(event) => {
                                setHideEmpty(event.target.checked);
                            }}
                        />
                    } label="Hide empty" />
                    <FormControlLabel control={
                        <Checkbox
                            checked={hideUnqualified}
                            label="Hide unqualified"
                            onChange={(event) => {
                                setHideUnqualified(event.target.checked);
                            }}
                        />
                    } label="Hide unqualified" />
                </Stack>
            </FormGroup>
            <DataGrid
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
                slots={{ toolbar: CustomToolbar }}
            // slotProps={{
            //     toolbar: {
            //         showQuickFilter: true,
            //     },
            // }}
            />
        </Container>
    </Box>;
}

export default MoneyMaking;
