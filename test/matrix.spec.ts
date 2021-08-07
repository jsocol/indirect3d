import { I3DXMatrix, I3DXMatrixMultiply, I3DXVector } from "../src/indirect3d/matrix";
import { expect } from 'chai';

describe('I3DXMatrixMultiply', () => {
  it('multiplies arbitrary matrices', () => {
    const A = new I3DXMatrix(2, 3, [1, 2, 3, 4, 5, 6]);
    const B = new I3DXMatrix(3, 2, [7, 8, 9, 10, 11, 12]);
    const expected = new I3DXMatrix(2, 2, [58, 64, 139, 154]);

    const actual = I3DXMatrixMultiply(A, B);
    expect(actual.rows).to.eq(expected.rows);
    expect(actual.cols).to.eq(expected.cols);
    expect(actual.data).to.deep.eq(expected.data);
  });

  it('multiples 3x3 matrices', () => {
    const A = new I3DXMatrix(3, 3, [12, 8, 4, 3, 17, 14, 9, 8, 10]);
    const B = new I3DXMatrix(3, 3, [5, 19, 3, 6, 15, 9, 7, 8, 16]);
    const expected = new I3DXMatrix(3, 3, [136, 380, 172, 215, 424, 386, 163, 371, 259]);

    const actual = I3DXMatrixMultiply(A, B);
    expect(actual.rows).to.eq(3);
    expect(actual.cols).to.eq(3);
    expect(actual.data).to.deep.eq(expected.data);
  });

  it('multiplies 4x4 matrices', () => {
    const A = new I3DXMatrix(4, 4, [2, 5, 7, 9, 3, 2, 1, 0, 12, 15, 8, 6, 11, 4, 16, 10]);
    const B = new I3DXMatrix(4, 4, [9, 6, 5, 3, 4, 11, 0, 7, 13, 1, 8, 2, 10, 12, 5, 9]);
    const expected = new I3DXMatrix(4, 4, [219, 182, 111, 136, 48, 41, 23, 25, 332, 317, 154, 211, 423, 246, 233, 183]);

    const actual = I3DXMatrixMultiply(A, B);
    expect(actual.rows).to.eq(4);
    expect(actual.cols).to.eq(4);
    expect(actual.data).to.deep.eq(expected.data);
  });

  it('multiplies matrices and vectors', () => {
    const A = new I3DXMatrix(4, 4, [2, 5, 7, 9, 3, 2, 1, 0, 12, 15, 8, 6, 11, 4, 16, 10]);
    const b = I3DXVector(4, [9, 7, 8, 10]);
    const expected = I3DXVector(4, [199, 49, 337, 355]);

    const actual = I3DXMatrixMultiply(A, b);
    expect(actual.rows).to.eq(4);
    expect(actual.cols).to.eq(1);
    expect(actual.data).to.deep.eq(expected.data);
  });
});
