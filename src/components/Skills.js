import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Stack from '@mui/material/Stack';

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

export default function Component({skills}) {
    // console.log(skills);
    return (
        <Grid
            container
            spacing={0.5}
            sx={{
                backgroundColor: '#3f3529',
                maxWidth: 204,
            }}
        >
            {skillOrder.map((skill, index) => {
                let icon = `https://oldschool.runescape.wiki/images/${skill}_icon.png?a4903`;

                if(skill === 'Combat level'){
                    icon = 'https://oldschool.runescape.wiki/images/Combat_icon.png?93d63';
                }

                return (
                    <Grid
                        md = {4}
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
                                {JSON.stringify(skills[skill])}
                            </div>
                        </Stack>
                    </Grid>
                );
            })}
        </Grid>
    );
}