import { vi } from 'vitest';

// Globally mock the Gemini AI SDK
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: JSON.stringify({
            records: [
              {
                name: 'Test User',
                email: 'test@example.com',
                crm_status: 'GOOD_LEAD_FOLLOW_UP',
              },
            ],
          }),
        }),
      },
    })),
  };
});

// Globally mock Prisma to prevent hitting the real SQLite DB during tests
vi.mock('../src/infrastructure/database/prisma.client', () => ({
  prisma: {
    importBatch: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    leadRecord: {
      createMany: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    $disconnect: vi.fn(),
  },
}));