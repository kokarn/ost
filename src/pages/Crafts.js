import Box from '@mui/material/Box';

import CraftTable from '../components/CraftTable.js';

import '../App.css';


function Items({latest, mapping, profits, dayData, volumes, filter}) {
    return <Box sx={{ flexGrow: 1 }}>
        <CraftTable
            latest={latest}
            mapping={mapping}
            profits={profits}
            filter={filter}
        />
    </Box>;
}

export default Items;
