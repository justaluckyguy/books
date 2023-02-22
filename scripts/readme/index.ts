import fs from 'fs/promises';
import path from 'path';

const rootDir = path.resolve('./scripts/readme');

async function readme() {
  const prefix = 'https://github.com/xjq7/books/tree/master/';
  const jsons = await fs.readdir(path.resolve('./scripts/readme/json'));
  const content = jsons.reduce((acc, title) => {
    title = title.replace('.json', '');
    const link = prefix + title;
    acc += `- [${title}](${link})\n`;
    return acc;
  }, '');
  let readmeContent = await fs.readFile('./README.md', { encoding: 'utf8' });
  readmeContent = readmeContent.replace(
    /(?<=<!--insert-books-head-->\n)(.|\n)+(?=<!--insert-books-end-->)/g,
    content
  );
  await fs.writeFile('./README.md', readmeContent, { encoding: 'utf8' });
}

async function run() {
  await readme();
}

run();
