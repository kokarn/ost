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
import ItemRow from '../components/ItemRow.js';
import calculateStoreProfit from '../modules/calculate-store-profit.mjs';

import stores from '../data/stores.json';
import itemProperties from '../data/item-properties.json';

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
    const [sellToStore, setSellToStore] = useState(false);
    const [onlyStackable, setOnlyStackable] = useState(true);

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
                continue;
            }

            if(storeItem.quantity <= 1){
                continue;
            }

            if(storeItem.sellPrice <= 0){
                continue;
            }

            if(onlyStackable && !itemProperties[mappingLookup[storeItem.name].id]?.stackable){
                continue;
            }

            storeItem.volume = volumes[mappingLookup[storeItem.name].id] || 0;

            // Remove all items with a low volume
            if(volumes[mappingLookup[storeItem.name].id] < 1000){
                continue;
            }

            storeItem.gePrice = latest[mappingLookup[storeItem.name].id].high;
            storeItem.profitRatio = storeItem.gePrice / storeItem.sellPrice;


            // storeItem.storeProfit = storeItem.quantity * (storeItem.gePrice - storeItem.sellPrice);
            storeItem.storeCost = calculateStoreProfit(storeItem.sellPrice, storeItem.storeChangeRate, storeItem.quantity)
            storeItem.storeProfit = storeItem.quantity * storeItem.gePrice - storeItem.storeCost;

            if(sellToStore){
                storeItem.profitRatio = storeItem.buyPrice / storeItem.gePrice;
            }

            storeItemRows.push({
                ...storeItem,
                id: id,
                itemId: mappingLookup[storeItem.name].id,
                icon: mappingLookup[storeItem.name].icon,
            });
        }

        return storeItemRows;
    }, [mapping, latest, volumes, sellToStore, onlyStackable]);

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
                // const itemData = craftRows.find((row) => row.name === value);
                // console.log(row);
                return <div>
                    <ItemRow
                        name={row.name}
                        icon={row.icon}
                        id={row.itemId}
                    />
                    <a
                        className='subtext'
                        href = {row.store}
                    >
                        {decodeURIComponent(row.store
                                .replace('https://oldschool.runescape.wiki/w/', '')
                                .replace(/_/g, ' ')
                                .replace(/\.$/, '')
                        )}
                    </a>
                </div>;
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
            headerName: 'Store buy price',
            renderCell: ({ value }) => numberFormat(value) || '',
            // width: 150,
        });
    } else {
        columns.splice(3, 0, {
            field: 'sellPrice',
            headerName: 'Store price',
            renderCell: ({ value }) => numberFormat(value),
            // width: 150,
        });
        columns.push({
                field: 'storeProfit',
                headerName: 'Per world',
                renderCell: ({row}) => {
                    return <div>
                        {numberFormat(row.storeProfit)}
                        <span
                            className='subtext'
                        >
                            {`Hourly: ${numberFormat(row.storeProfit * 240)}`}
                        </span>
                    </div>;
                },
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
                    } label="Sell to store" />
                    <FormControlLabel control={
                        <Checkbox
                            checked={onlyStackable}
                            label="Show only stackable"
                            onChange={(event) => {
                                setOnlyStackable(event.target.checked);
                            }}
                        />
                    } label="Show only stackable" />
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
                            field: 'storeProfit',
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
