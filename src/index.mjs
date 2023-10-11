import app from './app.mjs';
console.log(process.cwd());
app.listen(8000, () => {
  console.log(`SERVER RUNNING SUCCESSFULLY`);
});
