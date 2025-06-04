import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we're in build time - NEVER use mock in production runtime
const isBuildTime = false // Force real Prisma client in production

// Mock Prisma client for build time
const mockPrismaClient = {
  article: {
    findMany: () => Promise.resolve([]),
    findFirst: () => Promise.resolve(null),
    findUnique: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    groupBy: () => Promise.resolve([]),
  },
  category: {
    findMany: () => Promise.resolve([]),
    findFirst: () => Promise.resolve(null),
    findUnique: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
  },
  user: {
    findMany: () => Promise.resolve([]),
    findFirst: () => Promise.resolve(null),
    findUnique: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
  },
  analytics: {
    findMany: () => Promise.resolve([]),
    count: () => Promise.resolve(0),
    create: () => Promise.resolve({}),
    groupBy: () => Promise.resolve([]),
  },
  $connect: () => Promise.resolve(),
  $disconnect: () => Promise.resolve(),
} as any

// Create Prisma client with build-time safety
function createPrismaClient() {
  if (isBuildTime) {
    console.warn('🔧 Using mock Prisma client for build time')
    return mockPrismaClient
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'minimal',
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection
export async function testDatabaseConnection() {
  if (isBuildTime) {
    console.log('🔧 Mock database connection for build time')
    return true
  }

  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}
