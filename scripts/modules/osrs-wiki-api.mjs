import got from 'got';

// https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices

export const getLast1h = async (itemId) => {
    const response = await got(`https://prices.runescape.wiki/api/v1/osrs/1h`, {
        responseType: 'json',
    });

    return response.body.data;
};

export const getLast24h = async (itemId) => {
    const response = await got(`https://prices.runescape.wiki/api/v1/osrs/24h`, {
        responseType: 'json',
    });

    return response.body.data;
};

export default getLast1h ;


