import fs from 'fs';
import path from 'path';

/**
 * 首页数据写入
 *
 */
function readme() {
  const prefix = 'https://github.com/xjq7/books/tree/master/';

  const jsonDir = 'json';
  const jsons = fs.readdirSync(path.resolve(jsonDir), { encoding: 'utf8' });

  const content = jsons.reduce((acc, title) => {
    let jsonStr = fs.readFileSync(jsonDir + '/' + title, {
      encoding: 'utf8',
    });
    const json = JSON.parse(jsonStr) as Record<string, any>;

    title = title.replace('.json', '');
    const link = prefix + title;
    acc += `- [${title}](${link})\n`;
    Object.keys(json).forEach((category) => {
      acc += `  - [${category}](${link}#${category})\n`;
    });
    return acc;
  }, '');
  let readmeContent = fs.readFileSync('README.md', {
    encoding: 'utf8',
  });
  readmeContent = readmeContent.replace(
    /(?<=<!--insert-books-category-head-->\n)(.|\n)+(?=<!--insert-books-category-end-->)/gm,
    '\n' + content + '\n'
  );

  fs.writeFileSync('README.md', readmeContent, { encoding: 'utf8' });
}

/**
 * 子首页数据写入
 *
 */
function jsonWr() {
  const jsonDir = 'json';
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
      value.forEach(
        (
          o: {
            name: string;
            source: any[];
            spec: string[];
            version: string[];
            author: string[];
          },
          idx: number
        ) => {
          const { name, source, spec = [], version = [], author = [] } = o;
          content += `- ${name}\n`;

          let desc = '';
          if (author.length) {
            desc += `  作者: ${author.join(', ')}  \n`;
          }

          if (spec.length) {
            desc += `  包含 ${spec.join(', ')} 格式  \n`;
          }

          if (version.length) {
            desc += `  包含的版本: ${version.join(', ')}  \n`;
          }

          if (desc) {
            content += '\n';
            content += desc;
          }

          content += '\n';

          source.forEach((o) => {
            const { name, link, code } = o;
            content += `  - [${name}](${link})`;
            if (code) content += `, 提取码: ${code}`;
            content += '\n';
          });

          content += '***\n';
        }
      );
      content += '\n';
    });

    const readmePath = `${dirName}/README.md`;
    fs.writeFileSync(readmePath, content, { encoding: 'utf8' });
  }
}

function run() {
  jsonWr();
  readme();
}

run();
