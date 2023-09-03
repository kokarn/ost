import {
    // useEffect,
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

import numberFormat from '../modules/number-format.mjs';
import ItemRow from '../components/ItemRow.js';

import '../App.css';

timeago.register('en_short', en_short);

function Items({latest, mapping, profits, dayData, volumes, filter}) {
    const [highAlch, setHighAlch] = useState(true);
    let rows = [];

    for (const itemId in mapping) {
        // const volume = dayData[itemId]?.highPriceVolume + dayData[itemId]?.lowPriceVolume;

        if(!dayData[itemId]){
            continue;
        }

        rows.push({
            id: itemId,
            volume: volumes?.[itemId],
            lowAlchProfit: (mapping[itemId]?.lowalch || 0) - Math.max(dayData[itemId]?.avgHighPrice, dayData[itemId]?.avgLowPrice),
            highAlchProfit: (mapping[itemId]?.highalch || 0) - Math.max(dayData[itemId]?.avgHighPrice, dayData[itemId]?.avgLowPrice),
            ...dayData[itemId],
            ...mapping[itemId],
            ...latest[itemId],
        });
    }

    if (filter) {
        rows = rows.filter((row) => {
            if(row.name.toLowerCase().includes(filter.toLowerCase())){
                return true;
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
            headerName: 'High alch profit',
            // valueFormatter: ({ value }) => numberFormat(value),
            renderCell: ({ value }) => numberFormat(value),
            width: 120,
        },
    ];

    let craftRows = [];

    for (const result in profits) {
        craftRows.push({
            id: result,
            ...profits[result],
        });
    }

    if (filter) {
        craftRows = craftRows.filter((row) => {
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
        return params.model.input.length * 40 * params.densityFactor;
    };

    return <Box sx={{ flexGrow: 1 }}>
        <Container>
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
            <DataGrid
                density="standard"
                rows={rows}
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
                }}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                pageSizeOptions={[100]}
            />
        </Container>
        <Container>
            <DataGrid
                density="standard"
                rows={craftRows}
                columns={craftColumns}
                getRowHeight={calculateRowHeight}
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

export default Items;
