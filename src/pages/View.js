// import {
//     useMemo,
// } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import numberFormat from '../modules/number-format.mjs';
import ItemRow from '../components/ItemRow.js';

import '../App.css';

function View({latest, mapping, profits, filter}) {
    let rows = [];

    for (const result in profits) {
        rows.push({
            id: result,
            ...profits[result],
        });
    }

    if (filter) {
        rows = rows.filter((row) => {
            if(row.name.toLowerCase().includes(filter.toLowerCase())){
                return true;
            }

            for(const rowInput of row.input){
                if(mapping[rowInput].name.toLowerCase().includes(filter.toLowerCase())){
                    return true;
                }
            }

            return false;
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
            valueGetter: ({ value }) => {
                return value.map((itemId) => {
                    return mapping[itemId]?.name;
                });
            },
            renderCell: ({ value }) => {
                const itemComponents = value.map((itemName) => {
                    const item = Object.values(mapping).find((item) => item.name === itemName);
                    return <div
                        key={item.id}
                    >
                        {item.name}: {numberFormat(Math.min(latest[item.id]?.low, (profits[item.id]?.cost || 9999999)))}
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
            />
        </Container>
    </Box>;
}

export default View;
