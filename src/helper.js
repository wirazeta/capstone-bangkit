const { error } = require('console');
const { json } = require('express/lib/response');
const util = require('util');
const storage = require('./storage');
const Cloud = require('./storage');
const bucket = Cloud.bucket('petang-storage');

const {format} = util;

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file) => {
    let publicUrl = '';
    const { originalname, buffer } = file;
    const blob = bucket.file('uploads/' + originalname);
    const blobStream = blob.createWriteStream({
        resumable: false
    });

    blobStream.on('error', err => {
        return err; 
    })
    blobStream.on('finish', () => {
        publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/uploads/${blob.name}`
        )
    })
    blobStream.end(buffer);
    return `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
};

module.exports = uploadImage;
