import {
    memo,
} from 'react';
import {
    Handle,
} from 'reactflow';

import ItemRow from './ItemRow';

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
    </div>);
};

export default memo(ItemNode);