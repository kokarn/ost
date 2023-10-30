import {
    useMemo,
    useState,
    useRef,
} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Autocomplete from '@mui/material/Autocomplete';

import numberFormat from '../modules/number-format.mjs';

import '../App.css';

const calculate = (targetLevel) => {
    let previousLevel = targetLevel - 1;

    return 1/4 * Math.floor(previousLevel + 300 * (2 ** (previousLevel / 7)));
};

function Level({mapping, latest}) {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [targetLevel, setTargetLevel] = useState(2);
    const [experiencePerAction, setExperiencePerAction] = useState(1);
    const [costPerAction, setCostPerAction] = useState(1);
    const itemRef = useRef(null);
    const [currentItem, setCurrentItem] = useState(null);

    const availableItems = useMemo(() => {
        const availableItems = [];
        for (const [key, value] of Object.entries(mapping)) {
            if (value !== null) {
                availableItems.push(mapping[key].name);
            }
        }

        return availableItems.sort();
    }, [mapping]);

    const expNeeded = useMemo(() => {
        let currentExp = 0;
        for(let i = 1; i <= currentLevel; i = i + 1 ) {
            currentExp = currentExp + calculate(i);
        }

        let targetExp = 0;
        for(let i = 1; i <= targetLevel; i = i + 1 ) {
            targetExp = targetExp + calculate(i);
        }

        return targetExp - currentExp;
    }, [currentLevel, targetLevel]);

    return <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
    >
        <Container
            maxWidth="sm"
        >
            <TextField
                type="number"
                name="current-level"
                placeholder="Current Level"
                label="Current Level"
                value={currentLevel || ''}
                onChange={(event) => setCurrentLevel(Number(event.target.value))}
            />
            <TextField
                type="number"
                name="target-level"
                placeholder="Target Level"
                label="Target Level"
                value={targetLevel || ''}
                onChange={(event) => setTargetLevel(Number(event.target.value))}
            />
            <div>
                {`Exp Needed: ${numberFormat(Math.round(expNeeded))}`}
            </div>
            <TextField
                type="number"
                name="experience-per-action"
                placeholder="Experience per Action"
                label="Experience per Action"
                value={experiencePerAction || ''}
                onChange={(event) => setExperiencePerAction(Number(event.target.value))}
            />
            <div>
                {`Actions Needed: ${numberFormat(Math.round(expNeeded / experiencePerAction))}`}
            </div>
            <TextField
                type="number"
                name="cost-per-action"
                placeholder="Cost per Action"
                label="Cost per Action"
                value={costPerAction || ''}
                onChange={(event) => setCostPerAction(Number(event.target.value))}
            />
            <Autocomplete
                value={currentItem}
                disablePortal
                options={availableItems}
                onChange={(event, value) => {
                    const itemId = Object.values(mapping).find((item) => item.name === value)?.id;

                    if(!itemId) {
                        return true;
                    }

                    setCostPerAction(latest[itemId].low);
                }}
                renderInput={(params) => <TextField
                    {...params}
                    inputRef={itemRef}
                    label="Input item"
                />}
            />
            <div>
                {`Total cost: ${numberFormat(Math.round(expNeeded / experiencePerAction) * costPerAction)}`}
            </div>
        </Container>
    </Box>;
}

export default Level;
