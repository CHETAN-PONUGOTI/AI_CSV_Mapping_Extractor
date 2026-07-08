import { describe, it, expect } from 'vitest';
import { chunkArray } from '../../src/utils/chunker';

describe('Utility: chunkArray', () => {
  it('should split an array into chunks of the specified size', () => {
    const input = [1, 2, 3, 4, 5];
    const result = chunkArray(input, 2);
    
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
    expect(result.length).toBe(3);
  });

  it('should handle empty arrays', () => {
    const result = chunkArray([], 5);
    expect(result).toEqual([]);
  });

  it('should handle chunk sizes larger than the array length', () => {
    const input = [1, 2];
    const result = chunkArray(input, 10);
    
    expect(result).toEqual([[1, 2]]);
  });
});