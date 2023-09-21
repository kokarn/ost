const numberFormat = (number) => {
    const returnValue = new Intl.NumberFormat('sv-SE', {}).format(number);

    if(returnValue === 'NaN'){
        return false;
    }

    return returnValue;
};

export default numberFormat;