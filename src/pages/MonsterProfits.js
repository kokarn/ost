import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';

import numberFormat from '../modules/number-format.mjs';

import monsters from '../monsters.json';

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

function MonsterProfits({mapping, latest}) {
    // const rows = useMemo(() => {


    //     return returnRows;
    // }, [mapping, latest]);

    const rows = [];


    // console.log(itemMap);

    // console.log(mapping);

    if(Object.keys(latest).length !== 0){
        const itemMap = {};

        for(const itemId in mapping){
            itemMap[mapping[itemId].name.toLowerCase()] = itemId;
        }

        for (const result of monsters) {
            const monsterData = {
                id: result.name,
                ...result,
            };

            let totalLootValue = 0;

            for(const drop of monsterData.drops){
                let item = latest[itemMap[drop.item.toLowerCase()]];
                // console.log(drop.item);
                // console.log(item);

                if(!item && drop.item !== 'Coins'){
                    console.log(`Could not find item for ${drop.item}`);

                    continue;
                }

                if(!drop.quantity){
                    console.log(`Could not find quantity for ${drop.item}`);

                    continue;
                }

                if(drop.item === 'Coins'){
                    item = {
                        low: 1,
                    }
                }

                totalLootValue = totalLootValue + Math.floor(item.low * drop.quantity);

            }

            monsterData.lootValue = totalLootValue;

            rows.push(monsterData);
        }

        // console.log(itemMap);
        // console.log(rows);
    }

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
            headerName: 'Avg. Loot Value',
            renderCell: ({ value }) => numberFormat(value),
            width: 150,
        },
        {
            field: 'combatLevel',
            headerName: 'Combat Level',
            renderCell: ({ value }) => numberFormat(value),
            width: 150,
        },
    ];

    // const calculateRowHeight = (params) => {
    //     return (Object.keys(params.model.skills).length || 1) * 20 + (16 * params.densityFactor);
    // };

    return <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
    >
        <Container>
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
                // getRowHeight={calculateRowHeight}
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

export default MonsterProfits;
