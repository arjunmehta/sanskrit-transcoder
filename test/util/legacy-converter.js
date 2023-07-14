const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const util = require('util');
const linestream = require('line-stream');

const exec = util.promisify(cp.exec);

module.exports = ({
  wordList,
  sourceEncoding,
  targetEncoding
}) => {
  const sourceFilename = path.resolve(__dirname, `../../tmp/${sourceEncoding}.txt`);
  const targetFilename = path.resolve(__dirname, `../../tmp/${targetEncoding}.txt`);
  const sourceEncodingFile = fs.createWriteStream(sourceFilename);
  const commandString = `python3 convert.py ${sourceFilename} ${targetFilename} ${sourceEncoding} ${targetEncoding}`;

  const convertedWordList = [];


  wordList
    .forEach((value, i) => {
      if (value) {
        sourceEncodingFile.write(`${i} ${value}\r\n`);
      }
    });

  sourceEncodingFile.end();


  return new Promise((resolve) => {
    sourceEncodingFile
      .on('finish', () => {
        return exec(commandString, { cwd: path.resolve(__dirname) })
          .then(() => {
            const converted = fs.createReadStream(targetFilename, 'utf8');
            const lineReadStream = linestream();

            lineReadStream
              .on('data', (line) => {
                const val = line
                  .toString('utf8')
                  .substr(line.indexOf(' ') + 1)
                  .replace(/(\r\n|\n|\r)/gm, '');

                convertedWordList.push(val);
              })
              .on('end', () => {
                return resolve(convertedWordList);
              });

            converted.pipe(lineReadStream);
          })
          .catch((error) => {
            console.error('Error converting file');
            throw error;
          });
      });
  });
};
