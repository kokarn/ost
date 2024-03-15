import {
    useMemo,
    useState,
} from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TimeAgo from 'timeago-react';
import en_short from 'timeago.js/lib/lang/en_short';
import * as timeago from 'timeago.js';

import ItemRow from '../components/ItemRow.js';
import CustomNoRowsOverlay from '../components/NoRows.js';
import StickyTable from './StickyTable.js';

import numberFormat from '../modules/number-format.mjs';
import runescapeNumberFormat from '../modules/runescape-number-format.mjs';

import '../App.css';

timeago.register('en_short', en_short);

function GrandExchangeTable({latest, mapping, filter, dayData, volumes, shuffle = false}) {
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

        if(shuffle){
            // shuffle returnRows

            for (let i = returnRows.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [returnRows[i], returnRows[j]] = [returnRows[j], returnRows[i]];
            }
        }

        return returnRows;
    }, [latest, mapping, dayData, volumes, shuffle]);

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
                        className='subtext'
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
                        className='subtext'
                        locale='en_short'
                    />
                </div>;
            },
            width: 120,
        },
        {
            field: 'volume',
            headerName: 'Volume',
            valueFormatter: ({ value }) => runescapeNumberFormat(value),
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

    return [<FormGroup
        key = 'high-alch-checkbox'
    >
        <FormControlLabel control={
            <Checkbox
                checked={highAlch}
                label="High alch"
                onChange={(event) => {
                    setHighAlch(event.target.checked);
                }}
            />
        } label="High alc" />
    </FormGroup>,
    <StickyTable
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
            // sorting: {
            //     sortModel: [{
            //         field: 'highAlchProfit',
            //         sort: 'desc',
            //     }],
            // },
            pagination: {
                paginationModel: {
                    pageSize: 20,
                    page: 0,
                },
            },
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        key = 'grand-exchange-table'
        pageSizeOptions={[20]}
        // hideFooter
        slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            noResultsOverlay: CustomNoRowsOverlay,
        }}
    />];

}

export default GrandExchangeTable;
