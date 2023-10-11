import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import serveIndex from 'serve-index';
import checkFileType, { FILE_TYPE } from './util.mjs';
const app = express();
app.get('/', (req, res) => {
  res.redirect('/test');
});
app.get('/test', (req, res) => {
  res.status(200).json({
    message: 'Server running perfectly.',
  });
});
// app.use((req, res, next) => {
//   console.log('MIDDLEWARE');
//   next();
// });
// app.use(
//   '/file',
//   express.static(path.resolve(process.cwd(), 'src', 'data')),
//   serveIndex(path.resolve(process.cwd(), 'src', 'data'), { icons: true })
// );
app.get('/file/:filename*', async (req, res) => {
  const filename = path.join(req.params.filename, req.params[0]);
  console.log({ filename });
  if (!filename || filename.length === 0) {
    return res.status(500).json({
      error: true,
      statusCode: 500,
      message: 'Please Provide file name',
    });
  }
  //const filename = path.join(req.params.filename, req.params[0]);
  const filePath = path.join(process.cwd(), 'src', 'data', filename);
  const fileType = await checkFileType(filePath);
  if (fileType === FILE_TYPE.FILE) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return res.status(200).json({
      raw: fileContent,
    });
  }
  const nestedFiles = await fs.readdir(filePath);
  const mainUrl = req.protocol + '://' + req.get('host') + req.baseUrl;
  const _result = nestedFiles.map(async (nestedFileName) => {
    const fileOriginalPath = path.join(filePath, nestedFileName);
    return {
      name: nestedFileName,
      path: `${mainUrl}/file/${filename.replaceAll(
        '\\',
        '/'
      )}/${nestedFileName}`,
      type: await checkFileType(fileOriginalPath),
    };
  });
  const result = (await Promise.allSettled(_result)).map(({ value }) => value);
  res.status(200).json({
    result,
  });
});
export default app;
