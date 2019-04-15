// FSM = Finite State Machine

// Ported from:
// __program_name__ = 'transcoder.py'
// __author__ = 'Jim Funderburk'
// __email__ = 'funderburk1@verizon.net'
// __copyright__ = 'Copyright 2011, Jim Funderburk'
// __license__ = 'GPL http://www.gnu.org/licenses/gpl.txt'
// __date__ = '2011-12'

// Copyleft
// __program_name__ = 'transcoder.js'
// __author__ = 'Arjun Mehta'
// __email__ = 'arjunmeht@gmail.com'
// __copyright__ = 'Copyright 2019, Arjun Mehta'
// __license__ = 'GPL http://www.gnu.org/licenses/gpl.txt'
// __date__ = '2019-02'


const fsmDefinitions = require('./fsm-def.json');


const transcoderFSMIndex = {};
const vowelSigns = [
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

const vowelSignsUnicode = vowelSigns
  .map((vowelSign) => {
    return toUnicode(vowelSign);
  });


function transcoderFSM(sourceEncoding, targetEncoding) {
  const sourceTargetCombo = `${sourceEncoding}_${targetEncoding}`;
  if (transcoderFSMIndex[sourceTargetCombo]) {
    return null;
  }

  let regexCode = null;
  if (sourceEncoding.startsWith('slp1') && targetEncoding.startsWith('deva')) {
    regexCode = 'slp1_deva';
  } else if (sourceEncoding.startsWith('deva') && targetEncoding.startsWith('slp1')) {
    regexCode = 'deva_slp1';
  } else if (sourceEncoding.startsWith('hkt') && targetEncoding.startsWith('tamil')) {
    regexCode = 'hkt_tamil';
  }

  const fileIn = fsmDefinitions[sourceTargetCombo];

  if (!fileIn) {
    return null;
  }

  const xml = fileIn.fsm;
  const attributes = xml.attr;
  const { start } = attributes;
  const fsm = { start };
  const entries = xml.e;
  const fsmentries = [];

  entries
    .forEach((e) => {
      let inval = `${e.in}` || '';
      let conlook = false;
      const match = inval.match(/^([^/]+)\/\^/);

      if (match) {
        if (!regexCode) {
          return;
        }

        [, inval] = match;
        conlook = true;
      }

      const sval = e.s;
      const startStates = sval.split(',');
      const outval = `${e.out}` || '';
      const nextState = e.next ? e.next : startStates[0];

      const fsmentry = {
        starts: startStates,
        regex: conlook ? regexCode : undefined,
        in: toUnicode(inval),
        out: toUnicode(outval),
        next: nextState,
        inraw: inval,
        outraw: outval,
        'e-elt': e
      };

      fsmentries.push(fsmentry);
    });

  fsm.fsm = fsmentries;

  const states = {};
  let ientry = 0;

  fsmentries
    .forEach((fsmentry) => {
      const { in: inval } = fsmentry;
      let state;
      let c;

      if (inval.length > 0) {
        [c] = inval;
      } else {
        c = inval;
      }

      if (states[c]) {
        state = states[c];
        state.push(ientry);
        states[c] = state;
      } else {
        state = [];
        state.push(ientry);
        states[c] = state;
      }

      ientry += 1;
    });

  fsm.states = states;
  transcoderFSMIndex[sourceTargetCombo] = fsm;

  return fsm;
}


function toUnicode(originalString) {
  if (originalString === /\u/) {
    return originalString;
  }

  const hasUnicodeCharacters = originalString.match(/\\u/);

  if (hasUnicodeCharacters) {
    const unicodeParts = originalString.split(/\\u/);
    let convertedString = '';

    unicodeParts
      .forEach((part) => {
        if (part === '') {
          return;
        }

        let partA = part;
        let partB = '';

        if (part.length > 4) {
          partA = part.slice(0, 4);
          partB = part.slice(4);
        }

        if (partA.length === 4) {
          const characterCode = parseInt(partA, 16);
          partA = String.fromCharCode(characterCode);
        }

        convertedString += partA;
        convertedString += partB;
      });

    return convertedString;
  }

  return originalString;
}

function transcoderProcessStringMatch(line, n, m, fsmentry) {
  const edge = fsmentry.in;
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

  if (!fsmentry.regex) {
    return match;
  }

  const nmatch = match.length;
  const n1 = n + nmatch;

  if (n1 === m) {
    return match;
  }

  const d = line[n1];

  if (fsmentry.regex === 'slp1_deva') {
    const test = d.match(/[^aAiIuUfFxXeEoO^/\\\\]/);

    if (test) {
      return match;
    }

    return '';
  }

  if (fsmentry.regex === 'deva_slp1') {
    for (let i = 0; i < vowelSignsUnicode.length; i += 1) {
      const vowelSign = vowelSignsUnicode[i];
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


module.exports = function transcoderProcessString(line, sourceEncoding, targetEncoding) {
  if (sourceEncoding === targetEncoding) {
    return line;
  }

  const sourceTargetCombo = `${sourceEncoding}_${targetEncoding}`;
  let fsm;

  if (transcoderFSMIndex[sourceTargetCombo]) {
    fsm = transcoderFSMIndex[sourceTargetCombo];
  } else {
    transcoderFSM(sourceEncoding, targetEncoding);
    if (transcoderFSMIndex[sourceTargetCombo]) {
      fsm = transcoderFSMIndex[sourceTargetCombo];
    } else {
      return line;
    }
  }

  const {
    fsm: fsmentries,
    states
  } = fsm;

  let {
    start: currentState
  } = fsm;

  let n = 0;
  let result = '';
  const m = line.length;

  while (n < m) {
    const c = line[n];

    if (!states[c]) {
      result += c;
      currentState = fsm.start;
      n += 1;
      continue;
    }

    const isubs = states[c];
    let nbest = 0;
    let bestFE = null;

    for (let i = 0; i < isubs.length; i += 1) {
      const isub = isubs[i];

      const fsmentry = fsmentries[isub];
      const startStates = fsmentry.starts;
      const nstartStates = startStates.length;
      let k = -1;

      for (let j = 0; j < nstartStates; j += 1) {
        if (startStates[j] === currentState) {
          k = j;
          j = nstartStates;
        }
      }

      if (k === -1) {
        continue;
      }

      const match = transcoderProcessStringMatch(line, n, m, fsmentry);
      const nmatch = match.length;

      if (nmatch > nbest) {
        nbest = nmatch;
        bestFE = fsmentry;
      }
    }

    if (bestFE) {
      result += bestFE.out;
      n += nbest;
      currentState = bestFE.next;
    } else {
      result += c;
      currentState = fsm.start;
      n += 1;
    }
  }

  return result;
};
