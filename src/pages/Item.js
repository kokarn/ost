import {
    useEffect,
    useState,
    useMemo,
} from 'react';

import {
    useParams,
} from "react-router-dom";

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
import ReactFlow, {
    useNodesState,
    useEdgesState,
} from 'reactflow';

import runescapeNumberFormat from '../modules/runescape-number-format.mjs';
import craftsToNodes from '../modules/crafts-to-nodes.mjs';

// import CraftTable from '../components/CraftTable.js';
import Graph from '../components/Graph.js';
import ItemNode from '../components/ItemNode';
import CraftSelector from '../components/CraftSelector.js';

import stores from '../data/stores.json';

import 'reactflow/dist/style.css';

import '../App.css';
import '../flow-styles.css';

const TableBackground = ({children}) => {
    return (<Paper
        elevation={0}
    >
        {children}
    </Paper>);
};

const nodeTypes = {
    itemInput: ItemNode,
    itemOutput: ItemNode,
    item: ItemNode,
};

function Item({latest, mapping, crafts, dayData, volumes, filter}) {
    const routeParams = useParams();
    const itemData = Object.values(mapping).find((data) => data.urlName === routeParams.id);
    const [displayCraft, setDisplayCraft] = useState(0);
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    let storeLocations = [];

    for(const storeItem of stores) {
        if(storeItem.name !== itemData?.name) {
            continue;
        }

        storeLocations.push(storeItem);
    }

    const itemCrafts = useMemo(() => {
        let itemCrafts = [];
        let initialSelectionDone = false;
        for(const resultItemId in crafts) {
            if(!crafts[resultItemId].input.includes(itemData?.id)) {
                continue;
            }

            if(!initialSelectionDone) {
                setDisplayCraft(resultItemId);
                initialSelectionDone = true;
            }

            itemCrafts.push({
                key: resultItemId,
                value: mapping[resultItemId].name,
            });
        }

        return itemCrafts;
    }, [crafts, itemData, mapping]);

    useEffect(() => {
        const results = craftsToNodes(itemData, crafts, mapping, latest);

        setNodes(results.nodes.concat(results.recipes[displayCraft]?.nodes || []));
        setEdges(results.edges.concat(results.recipes[displayCraft]?.edges || []));
    }, [itemData, crafts, mapping, setNodes, setEdges, latest, displayCraft]);
    // const storeLocations = Object.keys(stores).filter((storeItem) => stores[storeItem].name.includes(itemData?.name));

    // console.log(storeLocations);

    const handleCraftChange = (event, newDisplayCraft) => {
        console.log(newDisplayCraft);
        if(newDisplayCraft !== null) {
            setDisplayCraft(newDisplayCraft);
        }
    };

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
        <Graph
            itemId={itemData?.id}
        />
        <Grid
            container
        >
            {nodes.length > 0 && <Grid
            md = {12}>
                <CraftSelector
                    handleCraftChange={handleCraftChange}
                    displayCraft={displayCraft}
                    itemCrafts={itemCrafts}
                />
            </Grid>}
            {nodes.length > 0 && <Grid
                md = {12}
                sx={{
                    height: crafts[displayCraft]?.input.length * 80,
                }}
            >
                <ReactFlow
                    defaultViewport={{
                        x: 550,
                        y: 20,
                        zoom: 2,
                    }}
                    edges={edges}
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    // onNodesChange={onNodesChange}
                    // onEdgesChange={onEdgesChange}
                    // onConnect={onConnect}
                    // fitView
                />
            </Grid>}
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
                                key={`${row.store}-${row.name}-${row.quantity}-${row.sellPrice}`}
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
