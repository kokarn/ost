const ignoreList = [
    'super_attack',
    'super_strength',
    'super_defence',
    'super_energy',
    'super_restore',
    'superantipoison',
];

const ItemRow = function({name, icon, id}) {
    if(!icon){
        icon = `${name.replace(/\(\d\)/, '')}.png`;

        if(name.includes('potion')){
            icon = `${name}.png`;
        }

        let formattedName = name.toLowerCase().replace(/ /g, '_');

        for(const ignore of ignoreList){
            if(formattedName.includes(ignore)){
                icon = `${name}.png`;
            }
        }
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
        <a
            href={`https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=${id}`}
        >
            {name}
        </a>
        <a
            href = {`https://www.osrs.exchange/item/${name.toLowerCase().replace(/ /g, '-')}`}
        >
            G
        </a>
    </div>;
};

export default ItemRow;