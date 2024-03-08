import {
    useCallback, useEffect,
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
    addEdge,
    useNodesState,
    useEdgesState,
} from 'reactflow';

import runescapeNumberFormat from '../modules/runescape-number-format.mjs';

// import CraftTable from '../components/CraftTable.js';
import Graph from '../components/Graph.js';
// import CustomNode from '../components/CustomNode';

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

const initialNodes = [
    // {
    //     id: '1',
    //     type: 'input',
    //     data: {
    //         label: 'Cadantine',
    //     },
    //     position: { x: -200, y: 5 },
    //     sourcePosition: 'right',
    // },
    // {
    //     id: '2',
    //     type: 'input',
    //     data: {
    //         label: 'Vial of Water',
    //     },
    //     position: { x: -200, y: 50 },
    //     sourcePosition: 'right',
    // },
    // {
    //     id: '3',
    //     data: {
    //         label: 'Cadantine Potion (unf)',
    //     },
    //     position: {
    //         x: -30,
    //         y: 5,
    //     },
    //     targetPosition: 'left',
    //     sourcePosition: 'right',
    // },
    // {
    //     id: '4',
    //     type: 'input',
    //     data: {
    //         label: 'White Berries',
    //     },
    //     position: {
    //         x: -30,
    //         y: 50,
    //     },
    //     sourcePosition: 'right',
    // },
    // {
    //     id: '5',
    //     data: {
    //         label: 'Super defence (3)',
    //     },
    //     position: {
    //         x: 150,
    //         y: 5,
    //     },
    //     targetPosition: 'left',
    //     type: 'output',
    //     // sourcePosition: 'right',
    // },
    // {
    //     id: '4',
    //     data: { label: 'Node 4' },
    //     position: { x: 400, y: 200 },
    //     type: 'custom',
    // },
];

const initialEdges = [
    // {
    //     id: 'e2-1',
    //     source: '1',
    //     target: '3',
    //     animated: true,
    // },
    // {
    //     id: 'e1-3',
    //     source: '2',
    //     target: '3',
    //     animated: true,
    // },
    // {
    //     id: 'e1-3',
    //     source: '4',
    //     target: '5',
    //     animated: true,
    // },
    // {
    //     id: 'e1-3',
    //     source: '3',
    //     target: '5',
    //     animated: true,
    // },
];

// const nodeTypes = {
//     custom: CustomNode,
// };

function Item({latest, mapping, crafts, dayData, volumes, filter}) {
    const routeParams = useParams();
    const itemData = Object.values(mapping).find((data) => data.urlName === routeParams.id);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
      (params) => setEdges((eds) => addEdge(params, eds)),
      [setEdges]
    );

    let storeLocations = [];

    for(const storeItem of stores) {
        if(storeItem.name !== itemData?.name) {
            continue;
        }

        storeLocations.push(storeItem);
    }

    useEffect(() => {
        let nodesCopy = [];
        let edgesCopy = [];
        let craftOffset = 0;
        for(const resultItemId in crafts) {
            // console.log(resultItemId, itemData?.id);
            if(resultItemId.toString() === itemData?.id.toString()) {
                nodesCopy.push({
                    id: resultItemId,
                    type: 'output',
                    data: {
                        label: mapping[resultItemId].name,
                    },
                    position: { x: 50, y: 0 + craftOffset },
                    // sourcePosition: 'right',
                    targetPosition: 'left',
                });

                let index = 0;
                for(const inputItemId of crafts[resultItemId].input) {
                    nodesCopy.push({
                        id: inputItemId.toString(),
                        type: 'input',
                        data: {
                            label: mapping[inputItemId].name,
                        },
                        position: { x: -150, y: 50 * index + craftOffset},
                        sourcePosition: 'right',
                    });

                    edgesCopy.push({
                        id: `${inputItemId}-${resultItemId}`,
                        source: inputItemId.toString(),
                        target: resultItemId.toString(),
                        animated: true,
                    });

                    index = index + 1;
                }

                craftOffset = craftOffset + (index * 25);
                continue;
            }

            if(crafts[resultItemId].input.includes(itemData?.id)) {
                nodesCopy.push({
                    id: resultItemId,
                    type: 'output',
                    data: {
                        label: mapping[resultItemId].name,
                    },
                    position: { x: 50, y: 0 + craftOffset },
                    // sourcePosition: 'right',
                    targetPosition: 'left',
                });

                let index = 0;
                for(const inputItemId of crafts[resultItemId].input) {
                    nodesCopy.push({
                        id: inputItemId.toString(),
                        type: 'input',
                        data: {
                            label: mapping[inputItemId].name,
                        },
                        position: { x: -150, y: 25 * index + craftOffset},
                        sourcePosition: 'right',
                    });

                    edgesCopy.push({
                        id: `${inputItemId}-${resultItemId}`,
                        source: inputItemId.toString(),
                        target: resultItemId.toString(),
                        animated: true,
                    });

                    index = index + 1;
                }

                craftOffset = craftOffset + (index * 25);
            }
        }
        // console.log(nodesCopy);
        // console.log(edgesCopy);
        setNodes(nodesCopy);
        setEdges(edgesCopy);
    }, [itemData, crafts, mapping, setEdges, setNodes]);
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
        <Graph
            itemId={itemData?.id}
        />
        <Grid
            container
        >
            <Grid
                md = {12}
                sx={{
                    height: 300,
                }}
            >
                <ReactFlow
                    nodes={nodes}
                    onNodesChange={onNodesChange}
                    edges={edges}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    // nodeTypes={nodeTypes}
                />
            </Grid>
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
