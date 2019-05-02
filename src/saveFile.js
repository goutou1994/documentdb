const fs = require('fs');
const path = require('path');

async function save({filename}, arr) {
    let s = filename.split('##');
    s = s.map(item => {
        if (item === '%date') {
            const d = new Date();
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
        }
        return item;
    });
    let files = [];
    await new Promise((resolve, reject) => {
        files.push(s.join('') + '.json');
        fs.writeFile(
            path.join(__dirname, '../json', `${s.join('')}.json`),
            JSON.stringify(arr),
            err => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
    return files;
}

module.exports = save;