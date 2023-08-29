const ItemRow = function({name, icon}) {
    if(!icon){
        icon = `${name.replace(/\(\d\)/, '')}.png`;
    }

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
        {name}
    </div>;
};

export default ItemRow;