import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";

// import CraftTable from '../components/CraftTable.js';
import Graph from '../components/Graph.js';

import '../App.css';

function Item({latest, mapping, profits, dayData, volumes, filter}) {
    const routeParams = useParams();
    const itemData = Object.values(mapping).find((data) => data.urlName === routeParams.id);

    return <Container>
        <Typography
            variant="h1"
        >
            {itemData?.name}
        </Typography>
        <Typography
            variant="subtitle1"
        >
            {itemData?.id}
        </Typography>
        <a
            href={`https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=${itemData?.id}`}
        >
            <img
                alt = {`${itemData?.name} icon`}
                src={`https://oldschool.runescape.wiki/images/${itemData?.icon.replace(/ /g, '_')}?cache`}
            />
            {'Wiki'}
        </a>
        <Graph
            itemId={itemData?.id}
        />
    </Container>;
}

export default Item;
