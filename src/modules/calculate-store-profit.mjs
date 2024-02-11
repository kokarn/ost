// const calculateStoreProfit = (value, stock) => {
//     const startPrice = (value * (130 - (3 * stock))) / 100;
//     const endPrice = 30 * value;

//     return Math.max(startPrice, endPrice);
// };

const calculateStoreProfit = (startPrice, shopIncrease, quantity) => {
    let totalPrice = 0;
    let currentPrice = startPrice;
    shopIncrease = shopIncrease / 100;

    for(let i = 0; i < quantity; i = i + 1){
        totalPrice = totalPrice + Math.floor(currentPrice);

        currentPrice = currentPrice + (startPrice * shopIncrease);
    }

    return totalPrice;
};

export default calculateStoreProfit;