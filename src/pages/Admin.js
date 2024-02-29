import {
    useMemo,
    useState,
    useRef,
} from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';

import numberFormat from '../modules/number-format.mjs';
import addRecipe from '../modules/add-recipe.mjs';

import '../App.css';

function Admin({latest, mapping, profits, dayData, volumes, filter}) {
    const [newRecipeItems, setNewRecipeItems] = useState([]);
    const [newRecipeResult, setNewRecipeResult] = useState(null);
    const itemRef = useRef(null);
    const countRef = useRef(null);
    const [currentItem, setCurrentItem] = useState(null);
    const [isResult, setIsResult] = useState(false);

    const availableItems = useMemo(() => {
        const availableItems = [];
        for (const [key, value] of Object.entries(mapping)) {
            if (value !== null) {
                availableItems.push(mapping[key].name);
            }
        }

        return availableItems.sort();
    }, [mapping]);

    const resetForm = () => {
        countRef.current.value = 1;
        setCurrentItem(null);
        setIsResult(false);
    };

    const handleAddItem = () => {
        const inputItem = Object.values(mapping).find((item) => item.name === itemRef.current.value);

        if(isResult){
            setNewRecipeResult(inputItem.id);
            resetForm();

            return true;
        }

        const currentRecipeItems = [...newRecipeItems];

        for(let i = 0; i < countRef.current.value; i = i + 1){
            currentRecipeItems.push(inputItem.id);
        }

        setNewRecipeItems(currentRecipeItems);

        resetForm();
    };

    const switchLabel = isResult ? 'Result' : 'Input';

    const saveRecipe = () => {
        addRecipe({
            input: newRecipeItems,
            result: newRecipeResult,
        });

        setNewRecipeItems([]);
        setNewRecipeResult(null);
        resetForm();
    };

    const handleTypeChange = () => {
        setIsResult(!isResult);
    };

    return <Box
        component="form"
        noValidate
        autoComplete="off"
    >
        <Container>
            <Typography
                variant="h1"
            >
                Admin
            </Typography>
            <FormGroup>
                <Stack
                    direction={'row'}
                >
                    <Autocomplete
                        value={currentItem}
                        disablePortal
                        options={availableItems}
                        onChange={(event, value) => {
                            setCurrentItem(value);
                        }}
                        renderInput={(params) => <TextField
                            {...params}
                            inputRef={itemRef}
                            label="Input item"
                        />}
                    />
                    <TextField
                        defaultValue={1}
                        inputRef={countRef}
                        label="Count"
                        name="count"
                        placeholder="Count"
                        type="number"
                    />
                    <FormControlLabel
                        control={<Switch
                            checked={!isResult}
                            onChange={handleTypeChange}
                            inputProps={{
                                'aria-label': 'Item type',
                            }}
                        />}
                        label = {switchLabel}
                    />
                    <Button
                        variant="text"
                        onClick={() => {
                            handleAddItem();
                        }}
                    >
                        {'Add'}
                    </Button>
                </Stack>
            </FormGroup>
            Output item: {newRecipeResult}
            <TableContainer>
                <Table
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {newRecipeItems.map((row) => (
                        <TableRow
                            key={row}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row}
                            </TableCell>
                            <TableCell align="right">
                                {mapping[row].name}
                            </TableCell>
                            <TableCell align="right">
                                {numberFormat(latest[row].high)}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="text"
                onClick={() => {
                    saveRecipe();
                }}
            >
                {'Save'}
            </Button>
        </Container>
    </Box>;
}

export default Admin;
