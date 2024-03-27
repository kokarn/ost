import {
    useMemo,
} from 'react';

import CustomNoRowsOverlay from './NoRows.js';
import ItemRow from './ItemRow.js';
import StickyTable from './StickyTable.js';

import numberFormat from '../modules/number-format.mjs';
import runescapeNumberFormat from '../modules/runescape-number-format.mjs';

import '../App.css';

function CraftTable({latest, mapping, crafts, filter}) {
    // console.log(crafts);
    const renderCraftRows = useMemo(() => {
        // Data grid needs the id property
        return crafts
            .map((craft) => {
                return {
                    id: craft.resultItemId,
                    ...craft,
                };
            })
            .filter((row) => {
                if(row.name.toLowerCase().includes(filter.toLowerCase())){
                    return true;
                }

                for(const rowInput of row.input){
                    const inputItemName = mapping[rowInput.id].name;

                    if(inputItemName.toLowerCase().includes(filter.toLowerCase())){
                        return true;
                    }
                }

                return false;
            }
        );
    }, [crafts, filter, mapping]);

    // console.log(renderCraftRows);

    const craftColumns = [
        {
            field: 'id',
            headerName: 'ID',
            // width: 70,
        },
        {
            field: 'name',
            flex: 1,
            headerName: 'Output',
            renderCell: ({ value }) => {
                const itemData = Object.values(mapping).find((row) => row.name === value);
                return <ItemRow
                    name={value}
                    icon={itemData?.icon}
                    id={itemData?.id}
                />;
            },
            minWidth: 200,
        },
        {
            field: 'volume',
            headerName: 'Volume',
            valueFormatter: (value) => runescapeNumberFormat(value),
            width: 120,
        },
        {
            field: 'input',
            headerName: 'Input',
            width: 200,
            // valueGetter: ({ value }) => {
            //     return value.map((itemId) => {
            //         return mapping[itemId]?.name;
            //     });
            // },
            renderCell: ({ value }) => {
                const itemComponents = value.map((itemRequirement) => {
                    const item = Object.values(mapping).find((item) => item.id.toString() === itemRequirement.id);
                    const itemPrice = Math.min(latest[item.id]?.low, (crafts[item.id]?.cost || 9999999));
                    return <div
                        key={item.id}
                    >
                        {itemRequirement.count}x {item.name}: {numberFormat(itemPrice * itemRequirement.count)}
                    </div>;
                });

                return <div>
                    {itemComponents}
                </div>;
            },
        },
        {
            field: 'cost',
            headerName: 'Cost',
            valueFormatter: (value) => numberFormat(value),
            width: 120,
        },
        {
            field: 'reward',
            headerName: 'Reward',
            valueFormatter: (value) => numberFormat(value),
            width: 120,
        },
        {
            field: 'profit',
            headerName: 'Profit',
            valueFormatter: (value) => numberFormat(value),
            width: 120,
        },
    ];

    const calculateRowHeight = (params) => {
        const uniqueItems = [...new Set(params.model.input)];

        return uniqueItems.length * 25 + (16 * params.densityFactor);
    };

    return <StickyTable
        autoHeight
        rows={renderCraftRows}
        columns={craftColumns}
        getRowHeight={calculateRowHeight}
        initialState={{
            columns: {
                columnVisibilityModel: {
                    id: false,
                },
            },
            sorting: {
                sortModel: [{
                    field: 'profit',
                    sort: 'desc',
                }],
            },
            pagination: {
                paginationModel: {
                    pageSize: 20,
                    page: 0,
                },
            },
        }}
        pageSizeOptions={[20]}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            noResultsOverlay: CustomNoRowsOverlay,
        }}
        // hideFooter
    />
    ;
}

export default CraftTable;
