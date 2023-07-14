const definitions = require('../def/fsm-def.json');

function getDefinition(sourceScheme, targetScheme) {
  const transcodeDefCode = `${sourceScheme}_${targetScheme}`;
  let definition = {};

  if (!(sourceScheme === 'slp1' || targetScheme === 'slp1')) {
    let firstStep;
    let secondStep;

    if (sourceScheme !== 'slp1') {
      firstStep = getDefinition(sourceScheme, 'slp1');
      secondStep = getDefinition('slp1', targetScheme);
    } else {
      firstStep = getDefinition('slp1', targetScheme);
      secondStep = getDefinition(sourceScheme, 'slp1');
    }

    Object.keys(firstStep).forEach((key) => {
      Object.assign(definition, {
        [key]: firstStep[key]
      });
    });

    Object.keys(secondStep).forEach((key) => {
      Object.assign(definition, {
        [key]: secondStep[key]
      });
    });
  } else {
    if (!definitions[transcodeDefCode]) {
      return null;
    }

    const { fsm } = definitions[transcodeDefCode];
    const { e } = fsm;

    definition = e;
  }

  return {
    [transcodeDefCode]: definition
  };
}


module.exports = getDefinition;
