import {
    useMemo,
    useState,
    useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { DataGrid } from '@mui/x-data-grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import numberFormat from '../modules/number-format.mjs';

import moneyMaking from '../data/money-making.json';

import '../App.css';

function MoneyMaking({filter, playerStats}) {
    const [hideEmpty, setHideEmpty] = useState(true);
    const [hideUnqualified, setHideUnqualified] = useState(true);

    const rows = useMemo(() => {
        let returnRows = [];

        for (const result of moneyMaking) {
            returnRows.push({
                id: result.methodName,
                ...result,
            });
        }

        returnRows = returnRows.filter((row) => {
            if(Object.keys(row.skills).length === 0 && hideEmpty){
                return false;
            }

            for (const skill in row.skills) {
                if (playerStats[skill] < row.skills[skill] && hideUnqualified) {
                    return false;
                }
            }

            if(filter && !row.methodName.toLowerCase().includes(filter.toLowerCase())){
                return false;
            }

            return true;
        });

        return returnRows;
    }, [playerStats, hideEmpty, hideUnqualified, filter]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            // width: 70,
        },
        {
            field: 'methodName',
            flex: 1,
            headerName: 'Name',
            renderCell: ({ value }) => {
                const itemData = rows.find((row) => row.methodName === value);
                return <a
                    href={`https://oldschool.runescape.wiki${itemData?.methodLink}`}
                >
                    {value}
                </a>;
            },
            minWidth: 200,
        },
        {
            field: 'hourlyProfit',
            headerName: 'Profit / Hour',
            renderCell: ({ value }) => numberFormat(value),
            // width: 200,
            // renderCell: ({ value }) => {
            //     const itemComponents = value.map((itemId) => {
            //         return <div
            //             key={itemId}
            //         >
            //             {mapping[itemId]?.name}: {numberFormat(Math.min(latest[itemId]?.low, (profits[itemId]?.cost || 9999999)))}
            //         </div>;
            //     });

            //     return <div>
            //         {itemComponents}
            //     </div>;
            // },
        },
        {
            field: 'skills',
            headerName: 'Skills',
            renderCell: ({ value }) => {
                const skillRequirements = [];
                for(const skill in value){
                    let isQualifiedClass = 'skill-ok';
                    if(playerStats[skill] < value[skill]){
                        isQualifiedClass = 'skill-not-ok';
                    }

                    skillRequirements.push(<div
                        key={skill}
                    >
                        <span
                            className={isQualifiedClass}
                        >
                            {skill}: {value[skill]}
                        </span>
                    </div>);
                };

                return <div>
                    {skillRequirements}
                </div>;
            },
            width: 200,
        },
        // {
        //     field: 'reward',
        //     headerName: 'Reward',
        //     valueFormatter: ({ value }) => numberFormat(value),
        //     width: 120,
        // },
        // {
        //     field: 'profit',
        //     headerName: 'Profit',
        //     valueFormatter: ({ value }) => numberFormat(value),
        //     width: 120,
        // },
    ];

    const calculateRowHeight = (params) => {
        return (Object.keys(params.model.skills).length || 1) * 25 + (16 * params.densityFactor);
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
                {`Money making`}
            </Typography>
            <FormGroup>
                <Stack
                    direction="row"
                >
                    <FormControlLabel control={
                        <Checkbox
                            checked={hideEmpty}
                            label="Hide empty requirements"
                            onChange={(event) => {
                                setHideEmpty(event.target.checked);
                            }}
                        />
                    } label="Hide empty" />
                    <FormControlLabel control={
                        <Checkbox
                            checked={hideUnqualified}
                            label="Hide unqualified"
                            onChange={(event) => {
                                setHideUnqualified(event.target.checked);
                            }}
                        />
                    } label="Hide unqualified" />
                </Stack>
            </FormGroup>
            <DataGrid
                density="standard"
                rows={rows}
                columns={columns}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                }}
                getRowHeight={calculateRowHeight}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
            />
        </Container>
    </Box>;
}

export default MoneyMaking;
