const urlFrieldlyName = (name) => {
    return name.toLowerCase().replace(/ /g, '-');
};

export default urlFrieldlyName;