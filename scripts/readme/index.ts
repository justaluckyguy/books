import fs from 'fs';
import path from 'path';

/**
 * 首页数据写入
 *
 */
async function readme() {
  const prefix = 'https://github.com/xjq7/books/tree/master/';
  const jsons = fs.readdirSync(path.resolve('./scripts/readme/json'));
  const content = jsons.reduce((acc, title) => {
    title = title.replace('.json', '');
    const link = prefix + title;
    acc += `- [${title}](${link})\n`;
    return acc;
  }, '');
  let readmeContent = fs.readFileSync('./README.md', {
    encoding: 'utf8',
  });
  readmeContent = readmeContent.replace(
    /(?<=<!--insert-books-head-->\n)(.|\n)+(?=<!--insert-books-end-->)/g,
    '\n' + content
  );
  fs.writeFileSync('./README.md', readmeContent, { encoding: 'utf8' });
}

/**
 * 子首页数据写入
 *
 */
async function jsonWr() {
  const jsonDir = './scripts/readme/json';
  const jsons = fs.readdirSync(path.resolve(jsonDir));

  for (const fileName of jsons) {
    const filePath = path.resolve(jsonDir + '/' + fileName);

    let jsonStr = fs.readFileSync(filePath, {
      encoding: 'utf8',
    });
    const json = JSON.parse(jsonStr) as Record<string, any>;

    const dirName = fileName.replace('.json', '');

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
    let content = '';

    Object.entries(json).forEach(([title, value]) => {
      content += `## ${title}\n\n`;
      value.forEach((o: { name: string; source: any[] }) => {
        const { name, source } = o;
        content += `- ${name}\n`;
        source.forEach((o) => {
          const { name, link, code } = o;
          content += `  - [${name}](${link})`;
          if (code) content += `, 提取码: ${code}`;
          content += '\n';
        });
      });
      content += '\n';
    });

    const readmePath = `${dirName}/README.md`;
    await fs.writeFileSync(readmePath, content, { encoding: 'utf8' });
  }
}

async function run() {
  await readme();
  await jsonWr();
}

run();
