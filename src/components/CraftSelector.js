import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function CraftSelector({handleCraftChange, displayCraft, itemCrafts}) {
    const handleChange = (event) => {
        handleCraftChange(event, event.target.value);
    };

    if(itemCrafts.length > 5){
        return (<FormControl>
            <InputLabel>
                Craft
            </InputLabel>
            <Select
                value={displayCraft}
                label="Craft"
                onChange={handleChange}
            >
                {itemCrafts.map((craft) => (
                    <MenuItem
                        value={craft.key}
                        key={craft.key}
                    >
                        {craft.value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>);
    } else {
        return (<ToggleButtonGroup
            size="small"
            value={displayCraft}
            onChange = {handleCraftChange}
            exclusive
            aria-label="Small sizes"
        >
        {itemCrafts.map((craft) => (
            <ToggleButton
                value={craft.key}
                key={craft.key}
            >
                {craft.value}
            </ToggleButton>
        ))}
        </ToggleButtonGroup>);
    }
};

export default CraftSelector;