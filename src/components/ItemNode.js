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
        <ItemRow
            name={data.label}
            icon={data.icon}
            id={data.id}
        />
        <div
            className='item-price'
        >
            {numberFormat(data.price)}gp
        </div>
    </div>);
};

export default memo(ItemNode);