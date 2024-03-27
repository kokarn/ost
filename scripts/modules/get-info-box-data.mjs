const getInfoBoxData = ($) => {
    const infoBox = $('.infobox tr');

    const data = {};

    infoBox.each((index, element) => {
        const key = $(element).find('th').text().trim();
        const value = $(element).find('td').text().trim();

        if(!key){
            return true;
        }

        if(data[key]){
            return true;
        }

        if(key === 'Location'){
            data['LocationLink'] = $(element).find('td a').attr('href');
        }

        data[key] = value;
    });

    return data;
};

export default getInfoBoxData;