import { useParams } from "react-router-dom";

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import runescapeNumberFormat from '../modules/runescape-number-format.mjs';

// import CraftTable from '../components/CraftTable.js';
import Graph from '../components/Graph.js';

import stores from '../data/stores.json';

import '../App.css';

const TableBackground = ({children}) => {
    return (<Paper
        elevation={0}
    >
        {children}
    </Paper>);
};

function Item({latest, mapping, profits, dayData, volumes, filter}) {
    const routeParams = useParams();
    const itemData = Object.values(mapping).find((data) => data.urlName === routeParams.id);

    let storeLocations = [];

    for(const storeItem of stores) {
        if(storeItem.name !== itemData?.name) {
            continue;
        }

        storeLocations.push(storeItem);
    }
    // const storeLocations = Object.keys(stores).filter((storeItem) => stores[storeItem].name.includes(itemData?.name));

    // console.log(storeLocations);

    return <Container>
        <Typography
            variant="h1"
        >
            {itemData?.name}
            <img
                alt = {`${itemData?.name} icon`}
                src={`https://oldschool.runescape.wiki/images/${itemData?.icon.replace(/ /g, '_')}?cache`}
            />
        </Typography>
        <Typography
            variant="subtitle2"
        >
            {itemData?.id}
        </Typography>
        {/* <a
            href={`https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=${itemData?.id}`}
        >

            {'Wiki'}
        </a> */}
        <Graph
            itemId={itemData?.id}
        />
        <Grid
            container
        >
            <Grid
                md = {4}
            >
                <Typography
                    variant={'h2'}
                >
                    {'Item information'}
                </Typography>
                <TableContainer
                    component={TableBackground}
                >
                    <Table
                        aria-label="simple table"
                        size="small"
                    >
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    {'Wiki link'}
                                </TableCell>
                                <TableCell align="right">
                                    <a
                                        href={`https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=${itemData?.id}`}
                                    >
                                        {'Wiki'}
                                    </a>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    {'Volume'}
                                </TableCell>
                                <TableCell align="right">
                                    {runescapeNumberFormat(volumes[itemData?.id])}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            {storeLocations.length > 0 && <Grid
                md = {4}
                mdOffset={4}
            >
                <Typography
                    variant={'h2'}
                >
                    {'Stores'}
                </Typography>
                <TableContainer
                    component={TableBackground}
                >
                    <Table
                        aria-label="simple table"
                        size="small"
                    >
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    Store
                                </TableCell>
                                <TableCell align="right">
                                    Quantity
                                </TableCell>
                                <TableCell align="right">
                                    Price
                                </TableCell>
                            </TableRow>
                        {storeLocations.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <a
                                        href = {row.store}
                                    >
                                        {decodeURIComponent(row.store
                                                .replace('https://oldschool.runescape.wiki/w/', '')
                                                .replace(/_/g, ' ')
                                                .replace(/\.$/, '')
                                        )}
                                    </a>
                                </TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">{row.sellPrice}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>}
        </Grid>
    </Container>;
}

export default Item;
