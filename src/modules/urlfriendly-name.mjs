const urlFrieldlyName = (name) => {
    return name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

export default urlFrieldlyName;