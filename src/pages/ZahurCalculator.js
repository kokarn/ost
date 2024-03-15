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

            const craft = crafts.find((craft) => craft.resultItemId === itemId.toString());

            itemMap[mapping[itemId]?.name.toLowerCase()] = itemId;

            const profit = craft?.reward - craft?.cost - 200;
            const totalCost = craft?.cost + 200;

            potionRows.push({
                id: itemId,
                name: mapping[itemId]?.name,
                input: craft?.input || [],
                zahurFee: 200,
                totalCost: totalCost,
                reward: craft?.reward,
                profit: profit,
                roi: profit / totalCost,
                profit1M: Math.floor(1000000 / totalCost) * profit,
                volume: volumes[itemId] || 0,
                icon: mapping[itemId]?.icon,
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
                    const itemPrice = Math.min(latest[item.id]?.low, (crafts[item.id]?.cost || 9999999));
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

export default Zahur;
