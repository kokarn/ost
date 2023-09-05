import {
    useMemo,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TimeAgo from 'timeago-react';
import en_short from 'timeago.js/lib/lang/en_short';
import * as timeago from 'timeago.js';
import Stack from '@mui/material/Stack';

import numberFormat from '../modules/number-format.mjs';
import ItemRow from '../components/ItemRow.js';
import CustomNoRowsOverlay from '../components/NoRows.js';

import '../App.css';
import { Typography } from '@mui/material';

timeago.register('en_short', en_short);

function Items({latest, mapping, profits, dayData, volumes, filter}) {
    const [highAlch, setHighAlch] = useState(true);

    const rows = useMemo(() => {
        let returnRows = [];
        for (const itemId in mapping) {
            if(!dayData[itemId]){
                continue;
            }

            returnRows.push({
                id: itemId,
                volume: volumes?.[itemId],
                lowAlchProfit: (mapping[itemId]?.lowalch || 0) - Math.max(dayData[itemId]?.avgHighPrice, dayData[itemId]?.avgLowPrice),
                highAlchProfit: (mapping[itemId]?.highalch || 0) - Math.max(dayData[itemId]?.avgHighPrice, dayData[itemId]?.avgLowPrice),
                ...dayData[itemId],
                ...mapping[itemId],
                ...latest[itemId],
            });
        }

        return returnRows;
    }, [latest, mapping, dayData, volumes]);

    const renderItemRows = useMemo(() => {
        return rows.filter((row) => {
            if(row.name.toLowerCase().includes(filter.toLowerCase())){
                return true;
            }

            return false;
        });
    }, [rows, filter]);

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
            minWidth: 200,
        },
        {
            field: 'high',
            headerName: 'Buy',
            // valueFormatter: ({ value }) => numberFormat(value),
            renderCell: ({row}) => {
                return <div>
                    {numberFormat(row.high)}
                    <TimeAgo
                        datetime={row.highTime * 1000}
                        className='time-ago'
                        locale='en_short'
                    />
                </div>;
            },
            width: 120,
        },
        {
            field: 'low',
            headerName: 'Sell',
            // valueFormatter: ({ value }) => numberFormat(value),
            renderCell: ({row}) => {
                return <div>
                    {numberFormat(row.low)}
                    <TimeAgo
                        datetime={row.lowTime * 1000}
                        className='time-ago'
                        locale='en_short'
                    />
                </div>;
            },
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
            headerName: 'Low alch',
            valueFormatter: ({ value }) => numberFormat(value),
            width: 120,
        },
        {
            field: 'highalch',
            headerName: 'High alch',
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
            headerName: 'High alch profit',
            // valueFormatter: ({ value }) => numberFormat(value),
            renderCell: ({ value }) => numberFormat(value),
            width: 120,
        },
    ];

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

    const calculateRowHeight = (params) => {
        return params.model.input.length * 20 + (16 * params.densityFactor);
    };

    return <Box sx={{ flexGrow: 1 }}>
        <Container>
            <Stack
                direction="row"
                justifyContent="space-between"
            >
                <Typography variant="h4" component="h4">
                    Grand Exchange
                </Typography>
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
                </FormGroup>
            </Stack>
            <DataGrid
                autoHeight
                rows={renderItemRows}
                columns={columns}
                columnVisibilityModel={{
                    lowAlchProfit: !highAlch,
                    lowalch: !highAlch,
                    highAlchProfit: highAlch,
                    highalch: highAlch,
                    id: false,
                }}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                    sorting: {
                        sortModel: [{
                            field: 'highAlchProfit',
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
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                hideFooter
                slots={{
                    noRowsOverlay: CustomNoRowsOverlay,
                    noResultsOverlay: CustomNoRowsOverlay,
                }}
            />
        </Container>
        <Container>
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
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                slots={{
                    noRowsOverlay: CustomNoRowsOverlay,
                    noResultsOverlay: CustomNoRowsOverlay,
                }}
                hideFooter
            />
        </Container>
    </Box>;
}

export default Items;
