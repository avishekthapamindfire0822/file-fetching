import fs from 'fs/promises';
export const FILE_TYPE = {
  DIRECTORY: 'directory',
  FILE: 'file',
};
export default async function checkFileType(path) {
  const fileStat = await fs.stat(path);
  if (fileStat.isDirectory()) {
    return FILE_TYPE.DIRECTORY;
  }
  return FILE_TYPE.FILE;
}
