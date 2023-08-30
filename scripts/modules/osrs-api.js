import got from 'got';

const getItem = async (itemId) => {
    const response = await got(`http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=${itemId}`, {
        json: true,
    });

    return response.body;
}

export default getItem ;
