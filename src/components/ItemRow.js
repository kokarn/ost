import urlFriendlyName from '../modules/urlfriendly-name.mjs';

const ItemRow = function({name, icon}) {
    icon = icon?.replace(/ /g, '_');

    return <div
        className='item-wrapper'
    >
        <div
            className="item-image-wrapper"
        >
            <img
                alt = {`${name} icon`}
                src={`https://oldschool.runescape.wiki/images/${icon}?cache`}
            />
        </div>
        <a
            href={`/item/${urlFriendlyName(name)}`}
        >
            {name}
        </a>
    </div>;
};

export default ItemRow;