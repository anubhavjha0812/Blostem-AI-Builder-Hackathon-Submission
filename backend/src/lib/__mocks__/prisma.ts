import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { prisma } = require('../../lib/prisma')

export const prismaMock = prisma as DeepMockProxy<PrismaClient>

beforeEach(() => {
  mockReset(prismaMock)
})
