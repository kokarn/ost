const ItemRow = function({name}) {
    return <div
        className='item-wrapper'
    >
        <div
            className="item-image-wrapper"
        >
            <img
                alt = {`${name} icon`}
                src={`https://oldschool.runescape.wiki/images/${name.replaceAll(' ', '_').replace(/\(\d\)/, '')}.png?cache`}
            />
        </div>
        {name}
    </div>;
};

export default ItemRow;