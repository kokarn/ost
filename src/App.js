import {
    useEffect,
    useState,
    // useMemo,
} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Outlet
} from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

import loadJSON from './modules/load-json.mjs';
import calculateProfit from './modules/calculate-profit.mjs';

import View from './View.js';
import Level from './Level.js';
import Items from './Items.js';

import './App.css';

function Layout() {
    return (
        <div>
            {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
            <AppBar position="static">
                <Toolbar disableGutters>
                    <Button
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        <Link to="/">
                            Home
                        </Link>
                    </Button>
                    <Button
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        <Link
                            to="/level"
                        >
                            Level
                        </Link>
                    </Button>
                    <Button
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        <Link
                            to="/items"
                        >
                            Items
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>

            {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
            <Outlet />
        </div>
    );
}

function App() {
    const [latest, setLatest] = useState([]);
    const [mapping, setMapping] = useState({});
    const [profits, setProfit] = useState({});
    const [lastDayData, setLastDayData] = useState({});

    useEffect(() => {
        const loadInitialData = async () => {
            const mappingData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/mapping`);
            const latestData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/latest`);
            const dayData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/24h`);

            const fullMap = {};

            for(const item of mappingData) {
                fullMap[item.id] = item;
            }

            setMapping(fullMap);
            setLatest(latestData.data);
            setLastDayData(dayData.data);

            const currentProfit = await calculateProfit(latestData.data, fullMap, dayData.data);
            setProfit(currentProfit);
        }

        loadInitialData();
    }, []);

    useEffect(() =>{
        let interval = setInterval(async () => {
            const latestData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/latest`);
            setLatest(latestData.data);
            const currentProfit = await calculateProfit(latestData.data, mapping, lastDayData);
            setProfit(currentProfit);
        }, 1000 * 60);

        //destroy interval on unmount
        return () => clearInterval(interval);
    }, [mapping, lastDayData])

    return (<Router>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<View
                    latest={latest}
                    mapping={mapping}
                    profits={profits}
                />} />
                <Route path="level" element={<Level />} />
                <Route path="items" element={<Items
                    latest={latest}
                    mapping={mapping}
                    profits={profits}
                    dayData={lastDayData}
                />} />
            </Route>
        </Routes>
    </Router>);
}

export default App;
