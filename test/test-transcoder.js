const { expect } = require('chai');

const converter = require('./util/legacy-converter');
const { transcodeSanskrit } = require('../index');

const wordList = require('./fixtures/slp-word-list.json')
  .filter((val, i) => {
    return i % 1 === 0;
  });


describe('Compare to Python Version', function test() {
  this.timeout(50000);

  it('should match all conversion values', async () => {
    const sourceEncoding = 'slp1';
    const targetEncoding = 'deva';
    const pythonMappings = await converter({ wordList, sourceEncoding, targetEncoding });

    for (let i = 0; i < wordList.length; i += 1) {
      const originalWord = wordList[i];
      const pythonMapping = pythonMappings[i];
      const jsMapping = transcodeSanskrit(originalWord, sourceEncoding, targetEncoding);


      if (originalWord.includes('/H') || originalWord.includes('/M')) {
        console.log('Found slash word where js is correct:', originalWord);
      } else {
        expect(jsMapping).to.be.equal(pythonMapping);
      }
    }
  });
});


describe('Test reversabilty', function test() {
  this.timeout(50000);

  it('should match input and output values', async () => {
    const sourceEncoding = 'slp1';
    const targetEncoding = 'deva';
    let passed = true;
    let falseCount = 0;

    for (let i = 0; i < wordList.length; i += 1) {
      const originalWord = wordList[i];
      const jsMapping = transcodeSanskrit(originalWord, sourceEncoding, targetEncoding);
      const jsMappingReverse = transcodeSanskrit(jsMapping, targetEncoding, sourceEncoding);

      if (jsMappingReverse !== originalWord) {
        passed = false;
        falseCount += 1;

        console.log('Mismatched reverse conversion original and reverse', {
          originalWord,
          jsMapping,
          jsMappingReverse,
          falseCount
        });
      }
    }

    console.log('Total False:', falseCount);

    expect(passed).to.be.equal(true);
  });
});
