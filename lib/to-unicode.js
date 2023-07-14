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


module.exports = toUnicode;
