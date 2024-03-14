const ItemIcon = ({name, icon}) => {
    icon = icon?.replace(/ /g, '_');

    return (
        <div
            className="item-image-wrapper"
        >
            <img
                alt = {`${name} icon`}
                src={`https://oldschool.runescape.wiki/images/${icon}?cache`}
            />
        </div>
    );
};

export default ItemIcon;
