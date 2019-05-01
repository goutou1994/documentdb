function format(arr) {
    return [...arr].map(obj => {
        let result = {};
        for (let key of Object.keys(obj)) {
            if (key[0] !== '_') {
                result[key] = obj[key];
            }
        }
        return result;
    });
}

module.exports = format;