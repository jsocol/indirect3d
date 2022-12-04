import { clamp } from '../src/indirect3d/utils';
import { expect } from 'chai';

describe('clamp', () => {
  it('allows the middle', () => {
    const actual = clamp(12, -1, 35);
    expect(actual).to.eq(12);
  });

  it('allows the upper boundary', () => {
    const actual = clamp(19, 5, 19);
    expect(actual).to.eq(19);
  });

  it('allows the lower boundary', () => {
    const actual = clamp(3, 3, 515);
    expect(actual).to.eq(3);
  });

  it('clamps the upper bound', () => {
    const actual = clamp(55, 5, 10);
    expect(actual).to.eq(10);
  });

  it('clamps to the lower bound', () => {
    const actual = clamp(-5, 0, 100);
    expect(actual).to.eq(0);
  });

  it('clamps NaN', () => {
    const actual = clamp(NaN, 0, 100);
    expect(actual).to.be.NaN;
  })
});
