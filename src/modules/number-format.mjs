const numberFormat = (number) => {
    return new Intl.NumberFormat('sv-SE', {}).format(number);
};

export default numberFormat;