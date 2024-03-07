import {
    useMemo,
    useState,
    useRef,
} from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
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

import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';

import numberFormat from '../modules/number-format.mjs';
import addRecipe from '../modules/add-recipe.mjs';

import '../App.css';

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
        ...style,
        top: style.top + LISTBOX_PADDING,
    };
  
    if (dataSet.hasOwnProperty('group')) {
      return (
            <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
                {dataSet.group}
            </ListSubheader>
      );
    }
  
    return (
        <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
            {`${dataSet[1]}`}
        </Typography>
    );
}
  
const OuterElementContext = React.createContext({});
  
const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});
  
function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);

    return ref;
}
  
  // Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = [];
    children.forEach((item) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
    });

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
        noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child) => {
        if (child.hasOwnProperty('group')) {
            return 48;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});
  
ListboxComponent.propTypes = {
    children: PropTypes.node,
};
  
  
const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0,
        },
    },
});

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
                    spacing={2}
                >
                    {/* <Autocomplete
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
                        size='small'
                        sx={{ width: 300 }}
                        value={currentItem}
                    /> */}
                    <Autocomplete
                        disableListWrap
                        PopperComponent={StyledPopper}
                        ListboxComponent={ListboxComponent}
                        options={availableItems}
                        renderInput={(params) => <TextField
                            {...params}
                            inputRef={itemRef}
                            label="Input item"
                        />}
                        onChange={(event, value) => {
                            setCurrentItem(value);
                        }}
                        renderOption={(props, option, state) => [props, option, state.index]}
                        size='small'
                        sx={{ width: 300 }}
                        value={currentItem}
                    />
                    <TextField
                        defaultValue={1}
                        inputRef={countRef}
                        label="Count"
                        name="count"
                        placeholder="Count"
                        type="number"
                        size='small'
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
                        variant="contained"
                        onClick={() => {
                            handleAddItem();
                        }}
                    >
                        {'Add'}
                    </Button>
                </Stack>
            </FormGroup>
            Output item: {mapping[newRecipeResult] ? mapping[newRecipeResult].name : ''}
            <TableContainer>
                <Table
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell align="right">
                                Value
                            </TableCell>
                            <TableCell align="right">
                                    Id
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {newRecipeItems.map((row) => (
                        <TableRow
                            key={row}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell
                                component="th" 
                                scope="row"
                            >
                                {mapping[row].name}
                            </TableCell>
                            <TableCell 
                                lign="right"
                            >
                                {numberFormat(latest[row].high)}
                            </TableCell>
                            <TableCell 
                                align="right"
                            >
                                {row}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="contained"
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
