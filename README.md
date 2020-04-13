# sanskrit-transcoder
Javascript port of the PHP/Python implementation of [sanskrit transcoding](https://github.com/funderburkjim/sanskrit-transcoding).

This is a simple package. Supports transcoding to and from SLP1 (Sanskrit Library Phonetic) transliteration scheme:

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
```

#### Advanced Example
```js
// HK -> Devanagari
const hkToSlp1 = sanskritTranscoder('jJAna', 'hk', 'slp1') // jYAna
const toDevanagari = sanskritTranscoder(hkToSlp1, 'slp1', 'deva') // jñāna
```


### API

#### sanskritTranscoder(`sourceString`, `sourceScheme`, `targetScheme`)
You must either convert to or from `slp1`. But if you need to do some more advanced transcoding you can combine calls.

- `sourceString` - the string to transcode which should be in the `sourceScheme`
- `sourceScheme` - the transcoding scheme that your `sourceString` is in.
- `targetScheme` - the transcoding scheme you want your output to be.



## License
### GPL License
Copyright 2019, Arjun Mehta
