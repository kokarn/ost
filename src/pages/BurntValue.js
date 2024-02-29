import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import numberFormat from '../modules/number-format.mjs';

import '../App.css';

import burntPrices from '../data/burnt-prices.txt';

const convertKToThousand = (str) => {
    if (typeof str === 'string' && str.slice(-1).toLowerCase() === 'k') {
        return parseFloat(str.slice(0, -1)) * 1000;
    } else {
        return parseFloat(str);
    }
};

function BurntValue() {
    const [lowTotal, setLowTotal] = useState(0);
    const [highTotal, setHighTotal] = useState(0);
    const [prices, setPrices] = useState({});
    const [currentBank, setCurrentBank] = useState({});

    useEffect(() => {
        fetch(burntPrices)
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n');
                let result = {};
                for(let i = 0; i < lines.length; i+=2) {
                    const key = lines[i];
                    const value = lines[i+1];
                    const itemPrice = {
                        low: Number(value),
                        high: Number(value),
                    };

                    if(value.includes('-')) {
                        const [low, high] = value.split('-');
                        itemPrice.low = Number(low);
                        itemPrice.high = Number(high);

                        if(low.includes('k')) {
                            itemPrice.low = convertKToThousand(low);
                        }

                        if(high.includes('k')) {
                            itemPrice.high = convertKToThousand(high);
                        }
                    }

                    result[key] = itemPrice;
                }

                const sortedArray = Object.entries(result).sort((a, b) => a[0].localeCompare(b[0]));
                const sortedObj = Object.fromEntries(sortedArray);

                setPrices(sortedObj);
            });
    }, []);

    useEffect(() => {
        let low = 0;
        let high = 0;
        Object.entries(currentBank).forEach(([key, value]) => {
            const itemPrice = prices[key];
            if(itemPrice) {
                low += itemPrice.low * value;
                high += itemPrice.high * value;
            }
        });
        setLowTotal(low);
        setHighTotal(high);
    }, [currentBank, prices]);

    const updateBank = (key, value) => {
        const newBank = {...currentBank};
        newBank[key] = value;
        setCurrentBank(newBank);
    };

    return <Box
        component="form"
        noValidate
        autoComplete="off"
    >
        <Container>
            <Typography
                variant='h1'
            >
                {`Burnt Value`}
            </Typography>
            <Typography
                variant='h2'
            >
                {`Total value: From ${numberFormat(lowTotal)} to ${numberFormat(highTotal)}`}
            </Typography>
            <Grid
                container
                spacing={2}
                justifyContent={'space-between'}
            >
            {Object.entries(prices).map(([key, value], index) => (
                <Grid>
                    <TextField
                        type="number"
                        name={key}
                        key = {key}
                        placeholder={key}
                        label={`${key} (${numberFormat(value.low)} - ${numberFormat(value.high)})`}
                        value={currentBank[key] || ''}
                        onChange={(event) => {
                            updateBank(key, Number(event.target.value));
                        }}
                    />
                </Grid>
            ))}
            </Grid>
        </Container>
    </Box>;
}

export default BurntValue;
