// import {
//     // useEffect,
//     useState
// } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';

// import loadJSON from './load-json.js';
import numberFormat from './modules/number-format.mjs';

import ItemRow from './ItemRow.js';

import './App.css';

import mapping from './mapping.json';
import latest from './latest.json';
import profits from './profits.json';

// let PROJECT_DATA_ID;
// if (window.location.hostname === 'localhost') {
//     PROJECT_DATA_ID = '1144240622516690944';
// } else {
//     PROJECT_DATA_ID = '1144240622516690944';
// }


const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        {/* Include the quick filter input */}
        <GridToolbarQuickFilter />

        {/* Add any other desired toolbar components */}
      </GridToolbarContainer>
    );
  };

const columns = [
    {
        field: 'id',
        headerName: 'ID',
        // width: 70,
    },
    {
        field: 'name',
        headerName: 'Output',
        width: 200,
        renderCell: ({ value }) => {
            return <ItemRow
                name = {value}
            />;
        },
    },
    {
        field: 'volume',
        headerName: 'Volume',
        valueFormatter: ({ value }) => numberFormat(value),
        // width: 70,
    },
    {
        field: 'input',
        headerName: 'Input',
        width: 200,
        renderCell: ({ value}) => {
            const itemComponents = value.map((itemId) => {
                return <div
                    key = {itemId}
                >
                    {mapping[itemId].name}: {numberFormat(Math.min(latest[itemId].low, (profits[itemId]?.cost || 9999999)))}
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
    },
    {
        field: 'reward',
        headerName: 'Reward',
        valueFormatter: ({ value }) => numberFormat(value),
    },
    {
        field: 'profit',
        headerName: 'Profit',
        valueFormatter: ({ value }) => numberFormat(value),
    },
];

function View() {
    // const capacity = await fetch('/capacity.json').then((response) => response.json());
    // const [recipes, setRecipes] = useState([]);
    // const [profits, setProfits] = useState([]);

    // console.log('capacity', capacity);
    // console.log('needs', needs);

    const rows = [];

    for (const result in profits) {
        rows.push({
            id: result,
            ...profits[result],
        });
    }

    // useEffect(() => {
    //     const loadInitialData = async () => {
    //         const data = await loadJSON(`https://jsonblob.com/api/jsonBlob/${PROJECT_DATA_ID}`);
    //         // console.log(data);

    //         setRecipes(data);
    //     }

    //     loadInitialData();
    // }, []);

    return <DataGrid
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
        slots={{ toolbar: CustomToolbar }}
        // slotProps={{
        //     toolbar: {
        //         showQuickFilter: true,
        //     },
        // }}
    />
}

export default View;
