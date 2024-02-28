import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import GrandExchangeTable from '../components/GrandExchangeTable.js';

import '../App.css';


function Items({latest, mapping, profits, dayData, volumes, filter}) {
    return <Box sx={{ flexGrow: 1 }}>
        <Container>
            <Typography
                variant="h1"
            >
                {'Grand Exchange'}
            </Typography>
            <GrandExchangeTable
                latest={latest}
                mapping={mapping}
                profits={profits}
                filter={filter}
                dayData={dayData}
                volumes={volumes}
            />
        </Container>
    </Box>;
}

export default Items;
