import {
    // useState,
    useMemo,
    // useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import StickyTable from '../components/StickyTable';
import ItemRow from '../components/ItemRow';

import numberFormat from '../modules/number-format.mjs';
import runescapeNumberFormat from '../modules/runescape-number-format.mjs';

import '../App.css';

const wesleyGrinds = {
    '5075': '6693',
    '10109': '10111',
    '9735': '9736',
    '237': '235',
    '243': '241',
    '1973': '1975',
    '26231': '26368',
    '11992': '11994',
    '249': '6681',
    '22124': '21975',
};

function Wesley({mapping, latest, filter, volumes}) {
    const rows = useMemo(() => {
        const itemMap = {};
        let potionRows = [];

        for(const inputItemId in wesleyGrinds){
            if(!mapping[inputItemId]){
                continue;
            }

            itemMap[mapping[inputItemId]?.name.toLowerCase()] = inputItemId;

            const profit = latest[wesleyGrinds[inputItemId]].low - latest[inputItemId].low - 50;
            const totalCost = latest[inputItemId].low + 50;

            potionRows.push({
                id: wesleyGrinds[inputItemId],
                name: mapping[wesleyGrinds[inputItemId]]?.name,
                input: [{
                    id: inputItemId,
                    count: 1,
                }],
                wesleyFee: 50,
                totalCost: totalCost,
                reward: latest[wesleyGrinds[inputItemId]].low,
                profit: profit,
                roi: profit / totalCost,
                profit1M: Math.floor(1000000 / totalCost) * profit,
                volume: volumes[wesleyGrinds[inputItemId]] || 0,
                icon: mapping[wesleyGrinds[inputItemId]]?.icon,
            });
        }


        return potionRows;
    }, [mapping, volumes, latest]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            // width: 70,
        },
        {
            field: 'name',
            flex: 1,
            headerName: 'Result',
            renderCell: ({row}) => {
                return <ItemRow
                    name={row.name}
                    icon={row?.icon}
                    id={row?.id}
                />;
            },
            minWidth: 200,
        },
        {
            field: 'input',
            headerName: 'Input',
            renderCell: ({ value }) => {
                const itemComponents = value.map((itemRequirement) => {
                    const item = Object.values(mapping).find((item) => item.id.toString() === itemRequirement.id);
                    const itemPrice = latest[item.id]?.low;
                    return <div
                        key={item.id}
                    >
                        {itemRequirement.count}x {item.name}: {numberFormat(itemPrice * itemRequirement.count)}
                    </div>;
                });

                return <div>
                    {itemComponents}
                </div>;
            },
            width: 170,
        },
        {
            field: 'wesleyFee',
            headerName: 'Wesley Fee',
            renderCell: ({ value }) => numberFormat(value),
        },
        {
            field: 'totalCost',
            headerName: 'Total cost',
            renderCell: ({ value }) => numberFormat(value) || '',
        },
        {
            field: 'reward',
            headerName: 'Reward',
            renderCell: ({ value }) => numberFormat(value) || '',
        },
        {
            field: 'profit',
            headerName: 'Profit',
            renderCell: ({ value }) => numberFormat(value) || '',
        },
        {
            field: 'roi',
            headerName: 'ROI',
            renderCell: ({ value }) => numberFormat(value * 100, 2) + '%',
        },
        {
            field: 'profit1M',
            headerName: 'Profit 1M',
            renderCell: ({ value }) => numberFormat(value),
        },
        {
            field: 'volume',
            headerName: 'Volume',
            renderCell: ({ value }) => runescapeNumberFormat(value),
        }
    ];

    const calculateRowHeight = (params) => {
        const uniqueItems = [...new Set(params.model.input)];

        return uniqueItems.length * 25 + (16 * params.densityFactor);
    };

    return <Box
        component="form"
        noValidate
        autoComplete="off"
    >
        <Container>
            <Typography
                variant='h1'
            >
                {`Wesley Calculator`}
            </Typography>
            <StickyTable
                density="standard"
                rows={rows}
                columns={columns}
                getRowHeight={calculateRowHeight}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                    sorting: {
                        sortModel: [{
                            field: 'roi',
                            sort: 'desc',
                        }],
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

export default Wesley;
