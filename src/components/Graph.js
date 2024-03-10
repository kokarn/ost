import { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

import numberFormat from '../modules/number-format.mjs';
import loadJSON from '../modules/load-json.mjs';

export default function Graph({itemId}) {
    const [xData, setXData] = useState([]);
    const [lowData, setLowData] = useState([]);
    const [highData, setHighData] = useState([]);
    const [historicalDays] = useState(1);
    const [scaleMax, setScaleMax] = useState(0);
    const [scaleMin, setScaleMin] = useState(0);

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

                setScaleMax(localMax * 1.1);
                setScaleMin(localMin * 0.9);
            }
        }

        loadData();
    }, [itemId, historicalDays]);

    return (
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
            height={300}
        />
    );
}