import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import GrandExchangeTable from '../components/GrandExchangeTable.js';

import '../App.css';


function Items({latest, mapping, dayData, volumes, filter}) {
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
                filter={filter}
                dayData={dayData}
                volumes={volumes}
            />
        </Container>
    </Box>;
}

export default Items;
