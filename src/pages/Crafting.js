import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import CraftTable from '../components/CraftTable.js';

import '../App.css';


function Items({latest, mapping, profits, dayData, volumes, filter}) {
    return <Box sx={{ flexGrow: 1 }}>
        <Container>
            <Typography
                variant='h1'
            >
                {`Crafting`}
            </Typography>
            <CraftTable
                latest={latest}
                mapping={mapping}
                profits={profits}
                filter={filter}
            />
        </Container>
    </Box>;
}

export default Items;
