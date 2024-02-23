import { DataGrid, gridClasses } from '@mui/x-data-grid';

function StickyTable(props) {
    return <DataGrid
        {...props}
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