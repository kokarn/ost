import {
    useMemo,
} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';

import CustomNoRowsOverlay from './NoRows.js';
import ItemRow from './ItemRow.js';

import numberFormat from '../modules/number-format.mjs';

import '../App.css';

function CraftTable({latest, mapping, profits, filter}) {
    const craftRows = useMemo(() => {
        let returnRows = [];

        for (const result in profits) {
            returnRows.push({
                id: result,
                ...profits[result],
            });
        }

        return returnRows;
    }, [profits]);

    const renderCraftRows = useMemo(() => {
        return craftRows.filter((row) => {
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
    }, [craftRows, filter, mapping]);

    const craftColumns = [
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
                const itemData = craftRows.find((row) => row.name === value);
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

    const calculateRowHeight = (params) => {
        return params.model.input.length * 20 + (16 * params.densityFactor);
    };

    return <Container>
        <Typography variant="h4" component="h4">
            Crafting
        </Typography>
        <DataGrid
            autoHeight
            rows={renderCraftRows}
            columns={craftColumns}
            getRowHeight={calculateRowHeight}
            initialState={{
                columns: {
                    columnVisibilityModel: {
                        id: false,
                    },
                },
                sorting: {
                    sortModel: [{
                        field: 'profit',
                        sort: 'desc',
                    }],
                },
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                        page: 0,
                    },
                },
            }}
            pageSizeOptions={[10]}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                noResultsOverlay: CustomNoRowsOverlay,
            }}
            // hideFooter
        />
    </Container>
    ;
}

export default CraftTable;
