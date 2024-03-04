import { DataGrid, gridClasses } from '@mui/x-data-grid';

import CustomNoRowsOverlay from './NoRows.js';

function StickyTable(props) {
    let renderProps = {...props};
    if(!renderProps?.slots?.noRowsOverlay){
        if(!renderProps.slots) {
            renderProps.slots = {};
        }

        renderProps.slots.noRowsOverlay = CustomNoRowsOverlay;
    }

    if(!renderProps?.slots?.noResultsOverlay){
        if(!renderProps.slots) {
            renderProps.slots = {};
        }

        renderProps.slots.noResultsOverlay = CustomNoRowsOverlay;
    }

    renderProps.autoHeight = true;

    return <DataGrid
        {...renderProps}
        sx={(theme) => ({
            [`.${gridClasses.main}`]: {
                overflow: "unset"
            },
            [`.${gridClasses.columnHeaders}`]: {
                position: "sticky",
                top: 0,
                backgroundColor: theme.palette.background.paper,
                zIndex: 1
            }
        })}
    />
};

export default StickyTable;