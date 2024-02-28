import {
    // useState,
    useMemo,
    // useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import StickyTable from '../components/StickyTable';

import numberFormat from '../modules/number-format.mjs';
import implings from '../data/implings.json';

import '../App.css';

function Implings({mapping, latest, filter}) {
    const rows = useMemo(() => {
        const itemMap = {};
        let monsterRows = [];

        for(const itemId in mapping){
            itemMap[mapping[itemId].name.toLowerCase()] = itemId;
        }

        for (const result of implings) {
            const monsterData = {
                id: result.name,
                ...result,
            };

            let totalLootValue = 0;

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

            monsterData.lootValue = totalLootValue;

            for(const itemId in mapping){
                if(mapping[itemId].name.toLowerCase() !== `${result.name.toLowerCase()} jar`){
                    continue;
                }

                monsterData.jarCost = latest[itemId].low;
                monsterData.jarProfit = totalLootValue - latest[itemId].low;
            }

            if(filter && monsterData.name.toLowerCase().indexOf(filter.toLowerCase()) === -1){
                continue;
            }

            monsterRows.push(monsterData);
        }

        return monsterRows;
    }, [mapping, latest, filter]);

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
            field: 'jarCost',
            headerName: 'Jar Cost',
            renderCell: ({ value }) => numberFormat(value),
            width: 150,
        },
        {
            field: 'jarProfit',
            headerName: 'Jar Profit',
            renderCell: ({ value }) => numberFormat(value) || '',
            width: 150,
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
                {`Implings`}
            </Typography>
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
                    sorting: {
                        sortModel: [{
                            field: 'jarProfit',
                            sort: 'desc',
                        }],
                    },
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                hideFooter
            />
        </Container>
    </Box>;
}

export default Implings;
