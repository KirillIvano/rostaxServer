const fs = require('fs');
const path = require('path');
const util = require('util');

const {createRandomKey} = require('~/helpers/createRandomKey');

const getDir = util.promisify(fs.readdir);
const moveFile = util.promisify(fs.rename);
const deleteFile = util.promisify(fs.unlink);

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

const getImagePath = filename => path.resolve(IMAGES_PATH, filename);

const saveImage = async (imageDir, fileExtension) => {
    const newFile = await generateFileName(fileExtension);
    const newFilePath = getImagePath(newFile);

    await moveFile(imageDir, newFilePath);
    return newFile;
};

const replaceImage = async (imageDir, imageName) => {
    await moveFile(imageDir, getImagePath(imageName));
};

const deleteImage = async imageName => {
    await deleteFile(getImagePath(imageName));
};

module.exports = {
    saveImage,
    replaceImage,
    deleteImage,
};
