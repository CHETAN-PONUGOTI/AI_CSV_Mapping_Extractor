import { describe, it, expect } from 'vitest';
import { CsvParserService } from '../../src/services/csv.parser.service';

describe('Service: CsvParserService', () => {
  it('should parse a valid CSV buffer into raw rows', async () => {
    const csvContent = 'Name,Email,Phone\nJohn Doe,john@test.com,1234567890\nJane Doe,jane@test.com,0987654321';
    const buffer = Buffer.from(csvContent);

    const result = await CsvParserService.parseBuffer(buffer);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ Name: 'John Doe', Email: 'john@test.com', Phone: '1234567890' });
    expect(result[1]).toEqual({ Name: 'Jane Doe', Email: 'jane@test.com', Phone: '0987654321' });
  });

  it('should ignore empty rows', async () => {
    const csvContent = 'Name,Email\nJohn,john@test.com\n,\nJane,jane@test.com';
    const buffer = Buffer.from(csvContent);

    const result = await CsvParserService.parseBuffer(buffer);

    expect(result).toHaveLength(2);
    expect(result[0].Name).toBe('John');
    expect(result[1].Name).toBe('Jane');
  });
});