const toUnicode = require('./to-unicode');


const devaVowelSigns = [
  '\u094d',
  '\u093e',
  '\u093f',
  '\u0940',
  '\u0941',
  '\u0942',
  '\u0943',
  '\u0944',
  '\u0962',
  '\u0963',
  '\u0947',
  '\u0948',
  '\u094b',
  '\u094c'
];

const devaVowelSignsUnicode = devaVowelSigns
  .map((vowelSign) => {
    return toUnicode(vowelSign);
  });


function processStringMatch(line, n, m, fsmEntry) {
  const edge = fsmEntry.in;
  const nedge = edge.length;

  let match = '';
  let j = n;
  let k = 0;
  let b = true;

  while ((j < m) && (k < nedge) && b) {
    if (line[j] === edge[k]) {
      j += 1;
      k += 1;
    } else {
      b = false;
    }
  }

  if (!b || k !== nedge) {
    return match;
  }

  match = edge;

  if (!fsmEntry.regex) {
    return match;
  }

  const nMatch = match.length;
  const n1 = n + nMatch;

  if (n1 === m) {
    return match;
  }

  const d = line[n1];

  if (fsmEntry.regex === 'slp1_deva') {
    const test = d.match(/[^aAiIuUfFxXeEoO^/\\\\]/);

    if (test) {
      return match;
    }

    return '';
  }

  if (fsmEntry.regex === 'deva_slp1') {
    for (let i = 0; i < devaVowelSignsUnicode.length; i += 1) {
      const vowelSign = devaVowelSignsUnicode[i];
      const vowelSignLen = vowelSign.length;
      let found = true;

      for (let r = 0; r < vowelSignLen; r += 1) {
        k = n1 + r;

        if (k >= m || vowelSign[r] !== line[k]) {
          found = false;
        }
      }

      if (found) {
        return '';
      }
    }

    return match;
  }

  return '';
}


module.exports = processStringMatch;
