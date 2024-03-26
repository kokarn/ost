import {
    useEffect,
    useState,
} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import MainMenu from './components/MainMenu.js';

// Modules
import loadJSON from './modules/load-json.mjs';
import calculateProfit from './modules/calculate-profit.mjs';
import urlFrieldlyName from './modules/urlfriendly-name.mjs';
import useStateWithLocalStorage from './hooks/useStateWithLocalStorage';
import calculateCombatLevel from './modules/calculate-combat-level.mjs';
import lowestPrice from './modules/get-lowest-price.mjs';

// Pages
import Admin from './pages/Admin.js';
import BurntValue from './pages/BurntValue.js';
import Crafting from './pages/Crafting.js';
import Diaries from './pages/Diaries.js';
import Implings from './pages/Implings.js';
import Item from './pages/Item.js';
import Items from './pages/Items.js';
import LevelCalculator from './pages/LevelCalculator.js';
import MoneyMaking from './pages/MoneyMaking.js';
import MonsterProfits from './pages/MonsterProfits.js';
import Stores from './pages/Stores.js';
import ZahurCalculator from './pages/ZahurCalculator.js';
import WesleyCalculator from './pages/WesleyCalculator.js';

import './App.css';

function App() {
    const [latest, setLatest] = useState([]);
    const [mapping, setMapping] = useState({});
    const [crafts, setCrafts] = useState([]);
    const [lastDayData, setLastDayData] = useState({});
    const [volumes, setVolumes] = useState({});
    const [itemFilter, setItemFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');
    const [playerName, setPlayerName] = useStateWithLocalStorage('playerName', '');
    const [playerStats, setPlayerStats] = useState({});

    useEffect(() => {
        const loadInitialData = async () => {
            const mappingData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/mapping`);
            const latestData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/latest`);
            const dayData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/24h`);
            const volumeData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/volumes`);

            const fullMap = {};

            for(const item of mappingData) {
                fullMap[item.id] = {
                    ...item,
                    urlName: urlFrieldlyName(item.name),
                    lowestPrice: lowestPrice({
                        itemId: item.id,
                        crafts: [],
                        latest: latestData.data || [],
                    }),
                };
            }

            setMapping(fullMap);
            setLatest(latestData.data);
            setLastDayData(dayData.data);
            setVolumes(volumeData.data);

            const currentProfit = await calculateProfit(latestData.data, fullMap, dayData.data);
            setCrafts(currentProfit);

            if(playerName) {
                const playerData = await loadJSON(`https://sync.runescape.wiki/runelite/player/${playerName}/STANDARD`);

                if(playerData.code !== 'NO_USER_DATA'){
                    const gamePlayerStats = playerData.levels;

                    gamePlayerStats['Quests'] = playerData.quests;
                    gamePlayerStats['Achievement diaries'] = playerData.achievement_diaries;

                    gamePlayerStats['Quest points'] = 0;
                    gamePlayerStats['Skills'] = 0;

                    for(const skill in playerData.levels){
                        if(skill === 'Skills'){
                            continue;
                        }

                        gamePlayerStats['Skills'] = gamePlayerStats['Skills'] + playerData.levels[skill];
                    }

                    for(const quest in playerData.quests){
                        gamePlayerStats['Quest points'] = gamePlayerStats['Quest points'] + playerData.quests[quest];
                    }

                    gamePlayerStats['Combat level'] = calculateCombatLevel(gamePlayerStats);

                    setPlayerStats(gamePlayerStats);
                }
            }
        }

        loadInitialData();
    }, [playerName]);

    useEffect(() =>{
        let interval = setInterval(async () => {
            const latestData = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/latest`);
            setLatest(latestData.data);
            const currentProfit = await calculateProfit(latestData.data, mapping, lastDayData);
            setCrafts(currentProfit);
        }, 1000 * 60);

        //destroy interval on unmount
        return () => clearInterval(interval);
    }, [mapping, lastDayData])

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedFilter(itemFilter);
        }, 250);

        return () => {
            clearTimeout(timerId);
        };
      }, [itemFilter]);

    return (<Router>
        <Routes>
            <Route
                path="/"
                element={<MainMenu
                    handleFilterChange={(e) => {
                        setItemFilter(e.target.value);
                    }}
                    handlePlayerNameChange={(value) => {
                        if(value){
                            setPlayerName(value);
                        }
                    }}
                    playerStats={playerStats}
                    playerName={playerName}
                />}
            >
                <Route
                    index
                    element={<Items
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
                        volumes={volumes}
                    />}
                />
                <Route
                    path="level-calculator"
                    element={<LevelCalculator
                        mapping={mapping}
                        latest={latest}
                    />}
                />
                <Route
                    path="money-making"
                    element={<MoneyMaking
                        filter={debouncedFilter}
                        playerStats={playerStats}
                    />}
                />
                <Route
                    path='crafting'
                    element={<Crafting
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
                        crafts={crafts}
                        volumes={volumes}
                    />}
                />
                <Route
                    path="monster-profits"
                    element={<MonsterProfits
                        latest={latest}
                        mapping={mapping}
                        filter={debouncedFilter}
                        playerStats={playerStats}
                    />}
                />
                <Route
                    path="implings"
                    element={<Implings
                        latest={latest}
                        filter={debouncedFilter}
                        mapping={mapping}
                    />}
                />
                <Route
                    path="burnt-value"
                    element={<BurntValue/>}
                />
                <Route
                    path="stores"
                    element={<Stores
                        latest={latest}
                        filter={debouncedFilter}
                        mapping={mapping}
                        volumes={volumes}
                    />}
                />
                <Route
                    path="diaries"
                    element={<Diaries
                        filter={debouncedFilter}
                        playerStats={playerStats}
                    />}
                />
                <Route
                    path="/item/:id"
                    element={<Item
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
                        crafts={crafts}
                        volumes={volumes}
                    />}
                />
                <Route
                    path="zahur-calculator"
                    element={<ZahurCalculator
                        latest={latest}
                        filter={debouncedFilter}
                        mapping={mapping}
                        volumes={volumes}
                        crafts={crafts}
                    />}
                />
                <Route
                    path="wesley-calculator"
                    element={<WesleyCalculator
                        latest={latest}
                        filter={debouncedFilter}
                        mapping={mapping}
                        volumes={volumes}
                    />}
                />
                <Route
                    path="admin"
                    element={<Admin
                        dayData={lastDayData}
                        filter={debouncedFilter}
                        latest={latest}
                        mapping={mapping}
                        crafts={crafts}
                        volumes={volumes}
                    />}
                />
            </Route>
        </Routes>
    </Router>);
}

export default App;
