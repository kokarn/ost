import { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import useMediaQuery from '@mui/material/useMediaQuery';

import numberFormat from '../modules/number-format.mjs';
import loadJSON from '../modules/load-json.mjs';
import runescapeNumberFormat from '../modules/runescape-number-format.mjs';

// const sampleSeries = (data, interval, maxDataPoints) => {
//     if(data.length <= maxDataPoints) {
//         return data;
//     }

//     // Initialize sampledItems array
//     let sampledItems = [data[0]];  // Include the first item

//     for(let i = 1; i < maxDataPoints - 1; i = i + 1) {
//         // For each segment, select the first item
//         let segmentItem = data[i * interval];
//         sampledItems.push(segmentItem);
//     }

//     sampledItems.push(data[data.length - 1]);  // Include the last item

//     return sampledItems;
// };

export default function PriceChart({itemId}) {
    const [xData, setXData] = useState([]);
    const [lowData, setLowData] = useState([]);
    const [highData, setHighData] = useState([]);
    const [historicalDays, setHistoricalDays] = useState(1);
    const [scaleMax, setScaleMax] = useState(0);
    const [scaleMin, setScaleMin] = useState(0);
    const [localMax, setLocalMax] = useState(0);
    const [localMin, setLocalMin] = useState(0);
    const [markSamples, setMarkSamples] = useState(10);

    const isMobile = useMediaQuery('(max-width:600px)');

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
        <ToggleButton
            value={365}
            key="right"
        >
            365d
        </ToggleButton>,
        <ToggleButton
            value={100000}
            key="right"
        >
            All time
        </ToggleButton>,
    ];

    useEffect(() => {
        const loadData = async () => {
            if(!itemId){
                return true;
            }

            let timeSeries;

            let currentDataPoints = 48;
            if(isMobile){
                currentDataPoints = 12;
            }

            if(historicalDays === 1){
                timeSeries = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=5m&id=${itemId}`);
            } else if(historicalDays === 7){
                timeSeries = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=1h&id=${itemId}`);
            } else if(historicalDays === 30){
                timeSeries = await loadJSON(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=6h&id=${itemId}`);
            } else if(historicalDays >= 30){
                timeSeries = await loadJSON(`https://api.weirdgloop.org/exchange/history/osrs/all?id=${itemId}&compress=false`);

                // filter out datapoints more than historicalDays old
                timeSeries.data = timeSeries[itemId]
                    .filter((datapoint) => {
                        return datapoint.timestamp > Date.now() - (3600 * 24 * historicalDays * 1000);
                    })
                    .map((datapoint) => {
                        return {
                            timestamp: datapoint.timestamp,
                            avgLowPrice: datapoint.price,
                            avgHighPrice: datapoint.price,
                            highPriceVolume: datapoint.volume,
                            lowPriceVolume: datapoint.volume,
                        };
                    });
            }

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

            setMarkSamples(Math.ceil(xData.length / currentDataPoints));

            // console.log(xData.length);
            // console.log(xData.length / currentDataPoints);

            // let interval = Math.floor((xData.length - 2) / (currentDataPoints - 2));

            // let sampledXData = sampleSeries(xData, interval, currentDataPoints);
            // let sampledLowData = sampleSeries(lowData, interval, currentDataPoints);
            // let sampledHighData = sampleSeries(highData, interval, currentDataPoints);

            // setXData(sampledXData);
            // setLowData(sampledLowData);
            // setHighData(sampledHighData);



            setXData(xData);
            setLowData(lowData);
            setHighData(highData);

            const localMax = Math.max(...highData.filter((value) => value !== null), ...lowData.filter((value) => value !== null));
            const localMin = Math.min(...lowData.filter((value) => value !== null), ...highData.filter((value) => value !== null));

            setLocalMax(localMax);
            setLocalMin(localMin);
            setScaleMax(localMax * 1.1);
            setScaleMin(localMin * 0.9);
        }

        loadData();
    }, [itemId, historicalDays, isMobile]);

    return (
        <Grid
            container
        >
            <Grid
                xs={6}
                md={10}
            >
                <ToggleButtonGroup
                    size="small"
                    value={historicalDays}
                    onChange = {handleChange}
                    exclusive
                    aria-label="Small sizes"
                >
                    {children}
                </ToggleButtonGroup>
            </Grid>
            <Grid
                xsOffset={2}
                xs={4}
                mdOffset={0}
                md={2}
                sx= {{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        textAlign: 'right',
                        width: '100%'
                    }}
                >
                    <div
                        className='price-chart-min-max'
                    >
                        Max: {numberFormat(localMax)}
                    </div>
                    <div
                        className='price-chart-min-max'
                    >
                        Min: {numberFormat(localMin)}
                    </div>
                </div>
            </Grid>
            <Grid
                md={12}
                xs={12}
                // Something like this works when we move the chart to composition
                sx = {{
                    '& .MuiResponsiveChart-container': {
                        overflow: 'visible',
                    },
                }}
            >
                <LineChart
                    xAxis={[{
                        data: xData,
                        scaleType: 'time',
                        valueFormatter: (unixTimestamp, context) => {
                            const time = new Date(unixTimestamp);

                            if(context.location === 'tick') {
                                // return time in local short form
                                return time.toLocaleTimeString(navigator.language, {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });

                            }

                            // return time in local short form
                            return time.toLocaleTimeString(navigator.language, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            });
                        },
                    }]}
                    yAxis={[{
                        scaleType: 'linear',
                        valueFormatter: runescapeNumberFormat,
                        max: scaleMax,
                        min: scaleMin,
                    }]}
                    series={[
                        {
                            data: lowData,
                            label: 'Low Price',
                            connectNulls: true,
                            showMark: ({ index }) => index % markSamples === 0,
                        },
                        {
                            data: highData,
                            label: 'High Price',
                            connectNulls: true,
                            showMark: ({ index }) => index % markSamples === 0,
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
                    // tooltip={{
                    //     trigger: "item",
                    //     itemContent: PriceChartTooltip,
                    // }}
                />
            </Grid>
        </Grid>
    );
}