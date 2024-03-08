import {
    // useState,
    useMemo,
    // useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import StickyTable from '../components/StickyTable';

import numberFormat from '../modules/number-format.mjs';
import runescapeNumberFormat from '../modules/runescape-number-format.mjs';

import '../App.css';

const zahurPotions = [
    91,
    93,
    95,
    97,
    99,
    101,
    103,
    105,
    107,
    109,
    111,
    2483,
    3002,
    3004,
    22443,
]

function Zahur({mapping, latest, filter, crafts, volumes}) {
    const rows = useMemo(() => {
        const itemMap = {};
        let potionRows = [];

        for(const itemId of zahurPotions){
            if(!mapping[itemId]){
                continue;
            }

            itemMap[mapping[itemId]?.name.toLowerCase()] = itemId;

            const profit = crafts[itemId]?.reward - crafts[itemId]?.cost - 200;
            const totalCost = crafts[itemId]?.cost + 200;

            potionRows.push({
                id: itemId,
                name: mapping[itemId]?.name,
                link: `https://oldschool.runescape.wiki/w/${mapping[itemId]?.name}`,
                input: crafts[itemId]?.input || [],
                zahurFee: 200,
                totalCost: totalCost,
                reward: crafts[itemId]?.reward,
                profit: profit,
                roi: profit / totalCost,
                profit1M: Math.floor(1000000 / totalCost) * profit,
                volume: volumes[itemId] || 0,
            });
        }


        return potionRows;
    }, [mapping, crafts, volumes]);

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
                // console.log(row);
                return <a
                    href={row.link}
                >
                    {row.name}
                </a>;
            },
            minWidth: 200,
        },
        {
            field: 'input',
            headerName: 'Input',
            renderCell: ({ value }) => {
                const itemCounts = {};
                for(const itemId of value){
                    if(!itemCounts[itemId]){
                        itemCounts[itemId] = 0;
                    }

                    itemCounts[itemId] = itemCounts[itemId] + 1;
                }

                const itemIds = [...new Set(value)];

                const itemComponents = itemIds.map((itemId) => {
                    const itemPrice = Math.min(latest[itemId]?.low, (crafts[itemId]?.cost || 9999999));
                    return <div
                        key={itemId}
                    >
                        {itemCounts[itemId]}x {mapping[itemId].name}: {numberFormat(itemPrice * itemCounts[itemId])}
                    </div>;
                });

                return <div>
                    {itemComponents}
                </div>;
            },
            width: 150,
        },
        {
            field: 'zahurFee',
            headerName: 'Zahur Fee',
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
                {`Zahur Calculator`}
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
                            field: 'jarProfit',
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

export default Zahur;
