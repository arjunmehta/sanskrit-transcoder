const fs = require('fs');
const path = require('path');
const parser = require('fast-xml-parser');

const fsmDef = {};
const sourceDirName = `${__dirname}/fsm-definitions`;
const XML_EXTENSION = '.xml';

const files = fs.readdirSync(sourceDirName).filter((file) => {
  return path.extname(file).toLowerCase() === XML_EXTENSION;
});

const parseOptions = {
  attributeNamePrefix: '',
  attrNodeName: 'attr',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  parseTrueNumberOnly: true
};


files.forEach((filename) => {
  const data = fs.readFileSync(`${sourceDirName}/${filename}`).toString();
  const result = parser.parse(data, parseOptions);
  const defname = path.basename(filename, XML_EXTENSION);

  fsmDef[defname] = result;
});


fs.writeFileSync(`${__dirname}/../fsm-def.json`, JSON.stringify(fsmDef, null, 2));
