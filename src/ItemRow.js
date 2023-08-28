const ItemRow = function({name}) {
    return <div
        className='item-wrapper'
    >
        <div
            className="item-image-wrapper"
        >
            <img src={`https://oldschool.runescape.wiki/images/${name.replaceAll(' ', '_')}.png?cache`} />
        </div>
        {name}
    </div>;
};

export default ItemRow;