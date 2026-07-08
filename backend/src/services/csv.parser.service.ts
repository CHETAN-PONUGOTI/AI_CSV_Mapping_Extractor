import * as fastcsv from 'fast-csv';
import { Readable } from 'stream';
import { RawCsvRow } from '../domain/types';

export class CsvParserService {
  static async parseBuffer(buffer: Buffer): Promise<RawCsvRow[]> {
    return new Promise((resolve, reject) => {
      const rows: RawCsvRow[] = [];
      const stream = Readable.from(buffer);

      stream
        .pipe(fastcsv.parse({ headers: true, trim: true }))
        .on('data', (row) => {
          if (Object.values(row).some(v => v !== '')) {
            rows.push(row);
          }
        })
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }
}