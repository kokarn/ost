import {
    useState,
    useMemo,
    // useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Stack } from '@mui/material';
// import TextField from '@mui/material/TextField';

import numberFormat from '../modules/number-format.mjs';
// import loadJSON from '../modules/load-json.mjs';

import stores from '../stores.json';

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

function StoreProfits({mapping, latest, volumes}) {
    const [sellToStore, setSellToStore] = useState(true);
    // const [playerStats, setPlayerStats] = useState({});
    // const [hideUnqualified, setHideUnqualified] = useState(true);
    // const [maxCombatLevel, setMaxCombatLevel] = useState(0);

    // console.log(mapping, latest);
    // console.log(volumes);
    const rows = useMemo(() => {
        let storeItemRows = [];
        const mappingLookup = {};

        for(const itemId in mapping){
            mappingLookup[mapping[itemId].name] = mapping[itemId];
        }

        for (const [id, storeItem] of stores.entries()) {
            if(isNaN(storeItem.sellPrice)){
                continue;
            }

            if (!mappingLookup[storeItem.name]) {
                // console.log  (`No item data for ${storeItem.name}`);

                continue;
            }

            storeItem.volume = volumes[mappingLookup[storeItem.name].id] || 0;

            if(volumes[mappingLookup[storeItem.name].id] < 1000){
                continue;
            }

            storeItem.gePrice = latest[mappingLookup[storeItem.name].id].high;
            storeItem.storeProfit = storeItem.quantity * (storeItem.gePrice - storeItem.sellPrice);
            storeItem.profitRatio = storeItem.gePrice / storeItem.sellPrice;

            if(sellToStore){
                storeItem.profitRatio = storeItem.buyPrice / storeItem.gePrice;
            }

            // if(storeItem.quantity < 5){
            //     continue;
            // }

            // if(storeItem.quantity < 100 && storeItem.profitRatio < 10){
            //     continue;
            // }

            // if(storeItem.profitRatio < 2){
            //     continue;
            // }

            // if(storeItem.storeProfit < 5000){
            //     continue;
            // }

            storeItemRows.push({
                ...storeItem,
                id: id,
            });
        }

        return storeItemRows;
    }, [mapping, latest, volumes, sellToStore]);

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
                    href={row.store}
                >
                    {row.name}
                </a>;
            },
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            renderCell: ({ value }) => numberFormat(value),
            width: 150,
        },
        {
            field: 'gePrice',
            headerName: 'GE price',
            renderCell: ({ value }) => numberFormat(value) || '',
            // width: 150,
        },
        {
            field: 'volume',
            headerName: 'GE volume',
            renderCell: ({ value }) => numberFormat(value) || '',
            // width: 150,
        },
        {
            field: 'profitRatio',
            headerName: 'Profit ratio',
            renderCell: ({ value }) => numberFormat(value) || '',
            // width: 150,
        }
    ];

    if(sellToStore){
        columns.splice(3, 0, {
            field: 'buyPrice',
            headerName: 'Buy price',
            renderCell: ({ value }) => numberFormat(value) || '',
            // width: 150,
        });
    } else {
        columns.splice(3, 0, {
            field: 'sellPrice',
            headerName: 'Sell price',
            renderCell: ({ value }) => numberFormat(value),
            // width: 150,
        });
        columns.push({
                field: 'storeProfit',
                headerName: 'Per store',
                renderCell: ({ value }) => numberFormat(value) || '',
                // width: 150,
        });
    }

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
            <FormGroup>
                <Stack
                    direction="row"
                >
                    <FormControlLabel control={
                        <Checkbox
                            checked={sellToStore}
                            label="Sell to store"
                            onChange={(event) => {
                                setSellToStore(event.target.checked);
                            }}
                        />
                    } label="Set sell to store" />
                    {/* <FormControlLabel control={
                        <Checkbox
                            checked={hideUnqualified}
                            label="Hide unqualified"
                            onChange={(event) => {
                                setHideUnqualified(event.target.checked);
                            }}
                        />
                    } label="Hide unqualified" /> */}
                    {/* <FormControlLabel control={
                        <TextField
                            label="Max combat level"
                            onChange={(event) => {
                                setMaxCombatLevel(event.target.value);
                            }}
                            type="number"
                        />
                    }/> */}
                </Stack>
            </FormGroup>
            <DataGrid
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
                            field: 'jarProfit',
                            sort: 'desc',
                        }],
                    },
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                slots={{ toolbar: CustomToolbar }}
            />
        </Container>
    </Box>;
}

export default StoreProfits;
