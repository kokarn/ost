import urlFriendlyName from '../modules/urlfriendly-name.mjs';

const ItemRow = function({name, icon, id}) {
    icon = icon.replace(/ /g, '_');

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
        {/* <a
            href={`https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=${id}`}
        > */}
        <a
            href={`/item/${urlFriendlyName(name)}`}
        >
            {name}
        </a>
        {/* <a
            href = {`https://www.osrs.exchange/item/${name.toLowerCase().replace(/ /g, '-')}`}
        >
            G
        </a>
        <a
            href = {`/item/${name.toLowerCase().replace(/ /g, '-')}`}
        >
            Data
        </a> */}
    </div>;
};

export default ItemRow;