const fsmDefinitions = require('../def/fsm-def.json');
const toUnicode = require('./to-unicode');


const fsmIndex = {};

function buildFinateStateMachine(sourceEncoding, targetEncoding) {
  const sourceTargetCombo = `${sourceEncoding}_${targetEncoding}`;
  if (fsmIndex[sourceTargetCombo]) {
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

  const rawFsmDefinition = fsmDefinitions[sourceTargetCombo];

  if (!rawFsmDefinition) {
    return null;
  }

  const { fsm: rawDefinitionRoot } = rawFsmDefinition;
  const { start } = rawDefinitionRoot.attr;
  const rawEntries = rawDefinitionRoot.e;
  const fsmEntries = [];

  const stateMachine = { start };

  rawEntries
    .forEach((rawEntry) => {
      let inval = `${rawEntry.in}` || '';
      let conlook = false;
      const match = inval.match(/^([^/]+)\/\^/);

      if (match) {
        if (!regexCode) {
          return;
        }

        [, inval] = match;
        conlook = true;
      }

      const sval = rawEntry.s;
      const startStates = sval.split(',');
      const outval = `${rawEntry.out}` || '';
      const nextState = rawEntry.next ? rawEntry.next : startStates[0];

      const fsmEntry = {
        starts: startStates,
        regex: conlook ? regexCode : undefined,
        in: toUnicode(inval),
        out: toUnicode(outval),
        next: nextState,
        inraw: inval,
        outraw: outval,
        'e-elt': rawEntry
      };

      fsmEntries.push(fsmEntry);
    });

  stateMachine.fsm = fsmEntries;

  const states = {};
  let ientry = 0;

  fsmEntries
    .forEach((fsmEntry) => {
      const { in: inval } = fsmEntry;
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

  stateMachine.states = states;
  fsmIndex[sourceTargetCombo] = stateMachine;

  return stateMachine;
}


module.exports = { fsmIndex, buildFinateStateMachine };
