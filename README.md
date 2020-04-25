# sanskrit-transcoder
Javascript port of the PHP/Python implementation of [sanskrit transcoding](https://github.com/funderburkjim/sanskrit-transcoding).

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
const sanskritTranscoder = require('sanskrit-transcoder')

let transcoded
transcoded = sanskritTranscoder('jYAna', 'slp1', 'deva') // ज्ञान
transcoded = sanskritTranscoder('jYAna', 'slp1', 'roman') // jñāna
transcoded = sanskritTranscoder('jJAna', 'hk', 'slp1') // jYAna
transcoded = sanskritTranscoder('jJAna', 'hk', 'deva') // ज्ञान
```


### API

#### sanskritTranscoder(`sourceString`, `sourceScheme`, `targetScheme`)

- `sourceString` - the string to transcode which should be in the `sourceScheme`
- `sourceScheme` - the transcoding scheme that your `sourceString` is in.
- `targetScheme` - the transcoding scheme you want your output to be.



## License
### GPL License
Copyright 2020, Arjun Mehta
