import Box from '@mui/material/Box';

import CraftTable from '../components/CraftTable.js';
import GrandExchangeTable from '../components/GrandExchangeTable.js';

import '../App.css';


function Items({latest, mapping, profits, dayData, volumes, filter}) {
    return <Box sx={{ flexGrow: 1 }}>
        <GrandExchangeTable
            latest={latest}
            mapping={mapping}
            profits={profits}
            filter={filter}
            dayData={dayData}
            volumes={volumes}
        />
        <CraftTable
            latest={latest}
            mapping={mapping}
            profits={profits}
            filter={filter}
        />
    </Box>;
}

export default Items;
