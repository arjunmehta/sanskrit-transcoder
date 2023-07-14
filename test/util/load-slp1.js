const fs = require('fs');
const path = require('path');
const util = require('util');

const cheerio = require('cheerio');
const linestream = require('line-stream');

const xml = fs.createReadStream(path.resolve(__dirname, './ext/xml/mw.xml'));
const writeFile = util.promisify(fs.writeFile);


// Define main parse function

function loadUniqueSLP1() {
  const fileStream = linestream();
  const uniqueStrings = {};

  let count = 0;

  return new Promise((resolve) => {
    fileStream
      .on('data', (line) => {
        const $ = cheerio.load(line, { xmlMode: true });
        let level;

        try {
          level = $.root().children()[0].name;
        } catch (e) {
          // no name
        }

        if (level) {
          const body = $('body')[0];
          const tail = $('tail')[0];

          if (body && tail) {
            const key1 = $('key1').text();
            const key2 = $('key2').text();
            const s = $('s');

            uniqueStrings[key1] = true;
            uniqueStrings[key2] = true;

            s.each((i, elem) => {
              const element = $(elem);
              const tSLP1 = element.text();

              if (tSLP1) {
                uniqueStrings[tSLP1] = true;
              }
            });
          }

          count += 1;
          if (count % 1000 === 0) {
            console.log(`${count} elements processed`);
          }
        }
      })
      .on('end', () => {
        console.log('Done Parsing XML');

        const rows = Object
          .keys(uniqueStrings)
          .map((key) => {
            return key;
          });

        return resolve(rows);
      });

    xml.pipe(fileStream);
  });
}


loadUniqueSLP1()
  .then((rows) => {
    const outputDir = path.resolve(__dirname, '../fixtures');
    const jsonOutputFilename = path.resolve(outputDir, 'slp-word-list.json');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    console.log('Writing fixture word list');
    process.stdout.write('\x07');
    return writeFile(jsonOutputFilename, JSON.stringify(rows, null, 2));
  })
  .catch((err) => {
    throw err;
  });
