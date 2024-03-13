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
import Skeleton from '@mui/material/Skeleton';
import ReactFlow, {
    useNodesState,
    useEdgesState,
} from 'reactflow';

import runescapeNumberFormat from '../modules/runescape-number-format.mjs';
import craftsToNodes from '../modules/crafts-to-nodes.mjs';
import getCraftCost from '../modules/get-craft-cost.mjs';

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
        for(const craft of crafts) {
            if(!craft.input.find((input) => input.id.toString() === itemData?.id.toString())) {
                continue;
            }

            if(!initialSelectionDone) {
                setDisplayCraft(craft.resultItemId);
                initialSelectionDone = true;
            }

            let cost = getCraftCost(craft.resultItemId, crafts, mapping);

            itemCrafts.push({
                key: craft.resultItemId,
                value: `${mapping[craft.resultItemId].name} ${craft.reward - cost}gp`,
                // craft: craft,
            });
        }

        return itemCrafts;
    }, [crafts, itemData, mapping]);

    const recipeItemHeight = useMemo(() => {
        // let recipeItemHeight = 1;
        let resultInputHeight = 1;
        let resultOutputHeight = 1;

        for(const craft of crafts) {
            // Check if the result of the craft is the item we are looking at
            if(craft.resultItemId.toString() === itemData?.id.toString()) {
                resultInputHeight = Math.max(craft.input.length, resultInputHeight);
            }

            if(craft.resultItemId.toString() === displayCraft.toString()) {
                resultOutputHeight = Math.max(craft.input.length, resultOutputHeight);
            }
        }

        return Math.max(resultInputHeight, resultOutputHeight);
    }, [crafts, displayCraft, itemData]);

    useEffect(() => {
        const results = craftsToNodes(itemData, crafts, mapping, latest);

        setNodes(results.nodes.concat(results.recipes[displayCraft]?.nodes || []));
        setEdges(results.edges.concat(results.recipes[displayCraft]?.edges || []));
    }, [itemData, crafts, mapping, setNodes, setEdges, latest, displayCraft]);

    const handleCraftChange = (event, newDisplayCraft) => {
        if(newDisplayCraft !== null) {
            setDisplayCraft(newDisplayCraft);
        }
    };

    return <Container>
        {itemData && <Typography
                variant="h1"
            >
                {itemData?.name}
                <img
                    alt = {`${itemData?.name} icon`}
                    src={`https://oldschool.runescape.wiki/images/${itemData?.icon.replace(/ /g, '_')}?cache`}
                    style={{
                        float: 'right',
                        height: '54px',
                        padding: '10px',
                    }}
                />
            </Typography>
        }
        {itemData && <Typography
            variant="subtitle2"
            >
                {itemData?.id}
            </Typography>
        }
        {!itemData && <Skeleton
                variant="text"
                sx={{ fontSize: '1rem' }}
                width={400} height={60}
            />
        }
        <Graph
            itemId={itemData?.id}
        />
        <Grid
            container
        >
            {nodes.length > 1 && <Grid
            md = {12}>
                <CraftSelector
                    handleCraftChange={handleCraftChange}
                    displayCraft={displayCraft}
                    itemCrafts={itemCrafts}
                />
            </Grid>}
            {nodes.length > 1 && <Grid
                md = {12}
                sx={{
                    height: recipeItemHeight * 120 + 20,
                }}
            >
                <ReactFlow
                    defaultViewport={{
                        x: 500,
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
                    panOnDrag={false}
                    zoomOnScroll={false}
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
