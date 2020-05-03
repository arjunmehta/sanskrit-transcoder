const { expect } = require('chai');

const getDefinition = require('../lib/get-definition');


describe('Get Definition', () => {
  it('should retrieve a definition from slp1', () => {
    const sourceEncoding = 'slp1';
    const targetEncoding = 'deva';
    const definition = getDefinition(sourceEncoding, targetEncoding);

    expect(typeof definition).to.be.equal('object');
  });

  it('should retrieve a definition to slp1', () => {
    const sourceEncoding = 'deva';
    const targetEncoding = 'slp1';
    const definition = getDefinition(sourceEncoding, targetEncoding);

    expect(typeof definition).to.be.equal('object');
  });

  it('should retrieve a definition from hk to deva', () => {
    const sourceEncoding = 'hk';
    const targetEncoding = 'deva';
    const definition = getDefinition(sourceEncoding, targetEncoding);

    expect(typeof definition).to.be.equal('object');
    expect(typeof definition.hk_deva).to.be.equal('object');
    expect(typeof definition.hk_deva.hk_slp1).to.be.equal('object');
    expect(typeof definition.hk_deva.slp1_deva).to.be.equal('object');
  });
});
