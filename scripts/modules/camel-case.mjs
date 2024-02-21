// Convert strings like 'Examine' to 'examine' and 'High alch' to 'highAlch'

const camelCase = (str) => {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+(.)/g, function(match, chr){
            return chr.toUpperCase();
        });
};

export default camelCase;