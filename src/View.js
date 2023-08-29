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
function View({latest, mapping, profits}) {
    const rows = [];

    for (const result in profits) {
        rows.push({
            id: result,
            ...profits[result],
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
            field: 'volume',
            headerName: 'Volume',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
        {
            field: 'input',
            headerName: 'Input',
            width: 200,
            renderCell: ({ value }) => {
                const itemComponents = value.map((itemId) => {
                    return <div
                        key={itemId}
                    >
                        {mapping[itemId]?.name}: {numberFormat(Math.min(latest[itemId]?.low, (profits[itemId]?.cost || 9999999)))}
                    </div>;
                });

                return <div>
                    {itemComponents}
                </div>;
            },
        },
        {
            field: 'cost',
            headerName: 'Cost',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
        {
            field: 'reward',
            headerName: 'Reward',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
        {
            field: 'profit',
            headerName: 'Profit',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
    ];

    return <Box sx={{ flexGrow: 1 }}>
        <Container>
            <DataGrid
                density="standard"
                rows={rows}
                columns={columns}
                getRowHeight={() => 'auto'}
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
                hideFooter
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

export default View;
