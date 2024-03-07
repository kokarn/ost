import {
    useRef,
} from 'react';

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import useStateWithLocalStorage from '../hooks/useStateWithLocalStorage';

let skillOrder = [
    'Attack',
    'Hitpoints',
    'Mining',
    'Strength',
    'Agility',
    'Smithing',
    'Defence',
    'Herblore',
    'Fishing',
    'Ranged',
    'Thieving',
    'Cooking',
    'Prayer',
    'Crafting',
    'Firemaking',
    'Magic',
    'Fletching',
    'Woodcutting',
    'Runecraft',
    'Slayer',
    'Farming',
    'Construction',
    'Hunter',
    'Combat level',
];

export default function Skills({playerName, playerStats, setPlayerName}) {
    const inputRef = useRef(null);

    return (
        <Box>
            <Typography
                variant='h5'
            >
                {playerName}
            </Typography>
            <Grid
                container
                spacing={1}
            >
                <Grid
                    xs = {8}
                >
                    <TextField
                        label='Set a player name'
                        size='small'
                        inputRef={inputRef}
                    />
                </Grid>
                <Grid
                    xs = {4}
                >
                    <Button
                        onClick={(event) => {
                            setPlayerName(inputRef.current.value);
                        }}
                        variant="contained"
                    >
                        {'Set'}
                    </Button>
                </Grid>
            </Grid>
            {playerName && <Grid
                container
                spacing={0.5}
                sx={{
                    backgroundColor: '#3f3529',
                    width: 204,
                }}
            >
                {skillOrder.map((skill, index) => {
                    let icon = `https://oldschool.runescape.wiki/images/${skill}_icon.png?a4903`;

                    if(skill === 'Combat level'){
                        icon = 'https://oldschool.runescape.wiki/images/Combat_icon.png?93d63';
                    }

                    return (
                        <Grid
                            xs = {4}
                            key = {index}
                        >
                            <Stack
                                alignItems={'center'}
                                className='skill-wrapper'
                                direction={'row'}
                                justifyContent={'space-between'}
                                key={index}
                                spacing={1}
                            >
                                <img
                                    alt = {`${skill} icon`}
                                    className='skill-icon'
                                    // https://oldschool.runescape.wiki/images/Thieving_icon_%28detail%29.png?a4903
                                    src={icon}
                                />
                                {/* <div>
                                    {skill}
                                </div> */}
                                <div
                                    className='skill-level-text-wrapper'
                                >
                                    {JSON.stringify(playerStats[skill])}
                                </div>
                            </Stack>
                        </Grid>
                    );
                })}
            </Grid>
        }
        </Box>
    );
}