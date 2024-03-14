import ItemIcon from './ItemIcon';

import urlFriendlyName from '../modules/urlfriendly-name.mjs';

const ItemRow = function({name, icon}) {
    return <div
        className='item-wrapper'
    >
        <ItemIcon
            name={name}
            icon={icon}
        />
        <a
            href={`/item/${urlFriendlyName(name)}`}
        >
            {name}
        </a>
    </div>;
};

export default ItemRow;