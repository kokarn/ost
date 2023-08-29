// import {
//     useEffect,
//     useState
// } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import numberFormat from './modules/number-format.mjs';
import ItemRow from './ItemRow.js';

import './App.css';

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
    const rows = [];

    for (const itemId in mapping) {
        const volume = dayData[itemId]?.highPriceVolume + dayData[itemId]?.lowPriceVolume;

        if(!dayData[itemId]){
            continue;
        }

        rows.push({
            id: itemId,
            volume: dayData[itemId]?.highPriceVolume + dayData[itemId]?.lowPriceVolume,
            lowAlchProfit: mapping[itemId]?.lowalch || 0 - dayData[itemId]?.avgHighPrice,
            highAlchProfit: mapping[itemId]?.highalch || 0 - dayData[itemId]?.avgHighPrice,
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
                return <ItemRow
                    name={value}
                    icon={rows.find((row) => row.name === value)?.icon}
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
        // {
        //     field: 'input',
        //     headerName: 'Input',
        //     width: 200,
        //     renderCell: ({ value }) => {
        //         const itemComponents = value.map((itemId) => {
        //             return <div
        //                 key={itemId}
        //             >
        //                 {mapping[itemId]?.name}: {numberFormat(Math.min(latest[itemId]?.low, (profits[itemId]?.cost || 9999999)))}
        //             </div>;
        //         });

        //         return <div>
        //             {itemComponents}
        //         </div>;
        //     },
        // },
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
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                pageSizeOptions={[5000]}
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

export default Items;
