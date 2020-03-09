const fs = require('fs');
const path = require('path');
const util = require('util');

const {createRandomKey} = require('~/helpers/createRandomKey');

const getDir = util.promisify(fs.readdir);
const moveFile = util.promisify(fs.rename);

const IMAGES_PATH = path.resolve(__dirname, '..', '..', 'images');

const generateFileName = async extension => {
    const dirContent = await getDir(IMAGES_PATH);

    while (true) {
        const fileName = `${createRandomKey()}.${extension}`;
        if (!dirContent.includes(fileName)) {
            return fileName;
        }
    }
};

const saveImage = async (imageDir, fileExtension) => {
    const newFile = await generateFileName(fileExtension);
    const newDir = path.resolve(IMAGES_PATH, newFile);

    await moveFile(imageDir, newDir);
    return newFile;
};

module.exports = {
    saveImage,
};
