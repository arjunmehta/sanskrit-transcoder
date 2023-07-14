const processStringMatch = require('./process-string-match');
const { fsmIndex, buildFinateStateMachine } = require('./state-machine');


function transcodeString(line, sourceEncoding, targetEncoding) {
  if (sourceEncoding === targetEncoding) {
    return line;
  }

  const sourceTargetCombo = `${sourceEncoding}_${targetEncoding}`;
  let fsm;

  if (fsmIndex[sourceTargetCombo]) {
    fsm = fsmIndex[sourceTargetCombo];
  } else {
    buildFinateStateMachine(sourceEncoding, targetEncoding);

    if (fsmIndex[sourceTargetCombo]) {
      fsm = fsmIndex[sourceTargetCombo];
    } else {
      return line;
    }
  }

  const {
    fsm: fsmEntries,
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
    let nBest = 0;
    let bestFE = null;

    for (let i = 0; i < isubs.length; i += 1) {
      const isub = isubs[i];

      const fsmEntry = fsmEntries[isub];
      const startStates = fsmEntry.starts;
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

      const match = processStringMatch(line, n, m, fsmEntry);
      const nMatch = match.length;

      if (nMatch > nBest) {
        nBest = nMatch;
        bestFE = fsmEntry;
      }
    }

    if (bestFE) {
      result += bestFE.out;
      n += nBest;
      currentState = bestFE.next;
    } else {
      result += c;
      currentState = fsm.start;
      n += 1;
    }
  }

  return result;
}


module.exports = transcodeString;
