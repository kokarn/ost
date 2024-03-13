import {
    memo,
} from 'react';
import {
    Handle,
} from 'reactflow';

import ItemRow from './ItemRow';

import numberFormat from '../modules/number-format.mjs';

import '../item-node.css';

const ItemNode = ({data, type, sourcePosition, targetPosition}) => {
    return (<div
        className='item-node'
    >
        {(type === 'item' || type === 'itemOutput') && <Handle
            type="target"
            position={targetPosition}
        />}
        {(type === 'item' || type === 'itemInput') && <Handle
            type="source"
            position={sourcePosition}
        />}
        {data.cost && <div
            className='item-cost'
        >
            Profit: {numberFormat(data.price - data.cost)}gp
        </div>
        }
        <ItemRow
            name={data.label}
            icon={data.icon}
            id={data.id}
        />

        <div
            className='item-price'
        >
            Cost: {numberFormat(data.price)}gp
        </div>
    </div>);
};

export default memo(ItemNode);