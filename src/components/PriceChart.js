import { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import numberFormat from '../modules/number-format.mjs';
import loadJSON from '../modules/load-json.mjs';

export default function PriceChart({itemId}) {
    const [xData, setXData] = useState([]);
    const [lowData, setLowData] = useState([]);
    const [highData, setHighData] = useState([]);
    const [historicalDays, setHistoricalDays] = useState(1);
    const [scaleMax, setScaleMax] = useState(0);
    const [scaleMin, setScaleMin] = useState(0);
    const [localMax, setLocalMax] = useState(0);
    const [localMin, setLocalMin] = useState(0);

    const handleChange = (event, newDateRange) => {
        setHistoricalDays(newDateRange);
    };

    const children = [
        <ToggleButton
            value={1}
            key="left"
        >
            24h
        </ToggleButton>,
        <ToggleButton
            value={7}
            key="center"
        >
            7d
        </ToggleButton>,
        <ToggleButton
            value={30}
            key="right"
        >
            30d
        </ToggleButton>,
        // <ToggleButton value="justify" key="justify">
        //   <FormatAlignJustifyIcon />
        // </ToggleButton>,
    ];


    useEffect(() => {
        const loadData = async () => {
            if(itemId){
                const timeSeries = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=5m&id=${itemId}`);
                let xData = [];
                let lowData = [];
                let highData = [];
                let currentTime = Date.now() / 1000;

                for(const datapoint of timeSeries.data){
                    if(datapoint.timestamp < currentTime - (3600 * 24 * historicalDays)){
                        continue;
                    }

                    xData.push(datapoint.timestamp * 1000);
                    lowData.push(datapoint.avgLowPrice || null);
                    highData.push(datapoint.avgHighPrice || null);
                }

                setXData(xData);
                setLowData(lowData);
                setHighData(highData);

                const localMax = Math.max(...highData.filter((value) => value !== null));
                const localMin = Math.min(...lowData.filter((value) => value !== null));

                setLocalMax(localMax);
                setLocalMin(localMin);
                setScaleMax(localMax * 1.1);
                setScaleMin(localMin * 0.9);
            }
        }

        loadData();
    }, [itemId, historicalDays]);

    return (
        <div>
            <ToggleButtonGroup
                size="small"
                value={historicalDays}
                onChange = {handleChange}
                exclusive
                aria-label="Small sizes"
            >
                {children}
            </ToggleButtonGroup>
            Min: {numberFormat(localMin)} Max: {numberFormat(localMax)}
            <LineChart
                xAxis={[{
                    data: xData,
                    scaleType: 'time',
                    // tickMinStep: 3600 * 1000 * ,
                    valueFormatter: (value) => new Date(value).toLocaleTimeString(),
                }]}
                yAxis={[{
                    scaleType: 'linear',
                    valueFormatter: numberFormat,
                    max: scaleMax,
                    min: scaleMin,
                }]}
                series={[
                    {
                        data: lowData,
                        label: 'Low Price',
                        connectNulls: true,
                        showMark: ({ index }) => index % 10 === 0,
                    },
                    {
                        data: highData,
                        label: 'High Price',
                        connectNulls: true,
                        showMark: ({ index }) => index % 10 === 0,
                    }
                ]}
                grid={{
                    horizontal: true,
                }}
                height={300}
                margin={{
                    // top: 10,
                    right: 0,
                    // bottom: 10,
                    left: 25,
                }}
            />
        </div>
    );
}