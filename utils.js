const fs = require("fs/promises");

const getMdFileList = async (dir, fileList) => {
  const files = await fs.readdir(dir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const isDir = (await fs.stat(dir + file)).isDirectory();
    if (isDir) {
      await getMdFileList(dir + file + "/", fileList);
    } else {
      fileList.push(dir + file);
    }
  };
};

module.exports = {
  getMdFileList,
};
