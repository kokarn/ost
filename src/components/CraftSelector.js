import {
    useMemo,
} from 'react';

// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import ItemIcon from './ItemIcon';

import numberFormat from '../modules/number-format.mjs';

function CraftSelector({handleCraftChange, displayCraft, itemCrafts}) {
    const handleChange = (event, newValue) => {
        handleCraftChange(event, newValue?.key || '');
    };

    const sortedCrafts = itemCrafts.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const selectedCraft = useMemo(() => {
        return sortedCrafts.find((craft) => {
            return craft.key === displayCraft;
        });
    }, [displayCraft, sortedCrafts]);

    return (<Autocomplete
        autoHighlight
        disablePortal
        label="Craft"
        onChange={handleChange}
        value={selectedCraft}
        options={sortedCrafts}
        getOptionLabel={(option) => {
            if(typeof option === 'string'){
                return option;
            }

            return option.name;
        }}
        size='small'
        sx = {{
            minWidth: 350,
        }}
        renderOption={(props, craft) => {
            return (<Box
                // key={craft.key}
                // value={craft.key}
                {...props}
            >
                <ItemIcon
                    name={craft.name}
                    icon={craft.icon}
                />
                {craft.name}
                <span
                    style={{
                        flexGrow: 1,
                        textAlign: 'right',
                    }}
                >
                    {numberFormat(craft.profit)}gp
                </span>
            </Box>)
        }}
        renderInput={(params) => (
            <TextField
                {...params}
                label="Craft"
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                }}
            />
        )}
    />);
        /* {sortedCrafts.map((craft) => (
            <MenuItem
                key={craft.key}
                sx={{
                    display: 'flex',
                }}
                value={craft.key}
            >
                <ItemIcon
                    name={craft.name}
                    icon={craft.icon}
                />
                {craft.name}
                <span
                    style={{
                        flexGrow: 1,
                        textAlign: 'right',
                    }}
                >
                    {numberFormat(craft.profit)}gp
                </span>
            </MenuItem>
        ))}
    // if(itemCrafts.length > 5){
    // } else {
    //     return (<ToggleButtonGroup
    //         aria-label="Small sizes"
    //         exclusive
    //         onChange = {handleCraftChange}
    //         size="small"
    //         value={displayCraft}
    //     >
    //     {sortedCrafts.map((craft) => (
    //         <ToggleButton
    //             className='craft-toggle-button'
    //             key={craft.key}
    //             value={craft.key}
    //         >
    //             <ItemIcon
    //                 name={craft.name}
    //                 icon={craft.icon}
    //             />
    //             {craft.name} - {craft.profit}gp
    //         </ToggleButton>
    //     ))}
    //     </ToggleButtonGroup>);
    // }
    */
};

export default CraftSelector;