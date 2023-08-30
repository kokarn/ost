import {
    // useEffect,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import numberFormat from '../modules/number-format.mjs';
import ItemRow from '../components/ItemRow.js';

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
function Items({latest, mapping, profits, dayData}) {
    const [highAlch, setHighAlch] = useState(true);
    const rows = [];

    for (const itemId in mapping) {
        const volume = dayData[itemId]?.highPriceVolume + dayData[itemId]?.lowPriceVolume;

        if(!dayData[itemId]){
            continue;
        }

        rows.push({
            id: itemId,
            volume: volume,
            lowAlchProfit: (mapping[itemId]?.lowalch || 0) - Math.max(dayData[itemId]?.avgHighPrice, dayData[itemId]?.avgLowPrice),
            highAlchProfit: (mapping[itemId]?.highalch || 0) - Math.max(dayData[itemId]?.avgHighPrice, dayData[itemId]?.avgLowPrice),
            ...dayData[itemId],
            ...mapping[itemId],
        });
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
            headerName: 'Output',
            renderCell: ({ value }) => {
                const itemData = rows.find((row) => row.name === value);
                return <ItemRow
                    name={value}
                    icon={itemData?.icon}
                    id={itemData?.id}
                />;
            },
        },
        {
            field: 'avgHighPrice',
            headerName: 'Buy',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
        {
            field: 'avgLowPrice',
            headerName: 'Sell',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
        {
            field: 'volume',
            headerName: 'Volume',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
        {
            field: 'lowalch',
            headerName: 'Low alch value',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
        {
            field: 'highalch',
            headerName: 'High alch value',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
        {
            field: 'lowAlchProfit',
            headerName: 'Low alch profit',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
        {
            field: 'highAlchProfit',
            headerName: 'high alch profit',
            // valueFormatter: ({ value }) => numberFormat(value),
            renderCell: ({ value }) => numberFormat(value),
            width: 120,
        },
    ];

    return <Box sx={{ flexGrow: 1 }}>
        <FormGroup>
            <FormControlLabel control={
                <Checkbox
                    checked={highAlch}
                    label="High alch"
                    onChange={(event) => {
                        setHighAlch(event.target.checked);
                    }}
                />
            } label="High alc" />
            {/* <FormControlLabel required control={<Checkbox />} label="Required" />
            <FormControlLabel disabled control={<Checkbox />} label="Disabled" /> */}
        </FormGroup>

        <Container>
            <DataGrid
                density="standard"
                rows={rows}
                columns={columns}
                columnVisibilityModel={{
                    lowAlchProfit: !highAlch,
                    lowalch: !highAlch,
                    highAlchProfit: highAlch,
                    highalch: highAlch,
                }}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                pageSizeOptions={[100]}
                slots={{ toolbar: CustomToolbar }}
            />
        </Container>
    </Box>;
}

export default Items;
