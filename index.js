// FSM = Finite State Machine

// Ported from:
// __program_name__ = 'transcoder.py'
// __author__ = 'Jim Funderburk'
// __email__ = 'funderburk1@verizon.net'
// __copyright__ = 'Copyright 2011, Jim Funderburk'
// __license__ = 'GPL http://www.gnu.org/licenses/gpl.txt'
// __date__ = '2011-12'

// Copyleft
// __program_name__ = 'sanskrit-transcoder'
// __author__ = 'Arjun Mehta'
// __email__ = 'arjunmeht@gmail.com'
// __copyright__ = 'Copyright 2019, Arjun Mehta'
// __license__ = 'GPL http://www.gnu.org/licenses/gpl.txt'
// __date__ = '2019-02'


const transcodeString = require('./lib/transcode-string');
const getDefinition = require('./lib/get-definition');
const definitions = require('./def/fsm-def.json');


function transcodeSanskrit(sourceString, sourceScheme, targetScheme) {
  if (sourceScheme === 'slp1' || targetScheme === 'slp1') {
    return transcodeString(sourceString, sourceScheme, targetScheme);
  }

  const toSLP1 = transcodeString(sourceString, sourceScheme, 'slp1');
  const fromSLP1 = transcodeString(toSLP1, 'slp1', targetScheme);

  return fromSLP1;
}


module.exports = {
  definitions,
  getDefinition,
  transcodeSanskrit
};
