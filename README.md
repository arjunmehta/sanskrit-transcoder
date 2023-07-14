# sanskrit-transcoder
Javascript port of the PHP/Python implementation of [sanskrit transcoding](https://github.com/funderburkjim/sanskrit-transcoding) by Jim Funderburk.

This module provides a single method to transcode a string to and from a number of transliteration schemes:

- `itrans` - [Indian languages TRANSliteration (ITRANS)](https://en.wikipedia.org/wiki/ITRANS)
- `hk` -  [Harvard-Kyoto (or Kyoto-Harvard)](https://en.wikipedia.org/wiki/Harvard-Kyoto)
- `roman` - [Romanized Sanskrit Transliteration (IAST)](https://en.wikipedia.org/wiki/Devanagari_transliteration#IAST)
- `deva` - [Devanagari](https://en.wikipedia.org/wiki/Devanagari) (Unicode)
- `wx` - [WX notation](https://en.wikipedia.org/wiki/WX_notation)

### Usage

```bash
npm install --save sanskrit-transcoder
```

#### Basic Example
```js
const { transcodeSanskrit } = require('sanskrit-transcoder')

let transcoded
transcoded = transcodeSanskrit('jYAna', 'slp1', 'deva') // ज्ञान
transcoded = transcodeSanskrit('jYAna', 'slp1', 'roman') // jñāna
transcoded = transcodeSanskrit('jJAna', 'hk', 'slp1') // jYAna
transcoded = transcodeSanskrit('jJAna', 'hk', 'deva') // ज्ञान
```


### API

#### transcodeSanskrit(`sourceString`, `sourceScheme`, `targetScheme`)

```es6
// destructured import
const { transcodeSanskrit } = require('sanskrit-transcoder')
```


- `sourceString` - the string to transcode which should be in the `sourceScheme`
- `sourceScheme` - the transcoding scheme that your `sourceString` is in.
- `targetScheme` - the transcoding scheme you want your output to be.


#### definitions (object)
```es6
// destructured import
const { definitions } = require('sanskrit-transcoder')
```

An object with the finite state machine definitions.

## License
### GPL License
Copyright 2020, Arjun Mehta
