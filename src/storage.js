const Cloud = require('@google-cloud/storage');
const path = require('path');

const {Storage} = Cloud;
const storage = new Storage({
    keyFilename: path.join(__dirname, './custom-resource-351302-9c1cffdc59f2.json'),
    projectId: 'custom-resource-351302'
});

module.exports = storage;