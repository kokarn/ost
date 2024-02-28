const numberFormat = (number) => {
    const returnValue = new Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(number);

    if(returnValue === 'NaN'){
        return false;
    }

    return returnValue;
};

export default numberFormat;