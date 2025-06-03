// Build-time database mock to prevent connection issues during build
export const buildTimeDb = {
  article: {
    findMany: () => Promise.resolve([]),
    findFirst: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
  },
  category: {
    findMany: () => Promise.resolve([]),
    findFirst: () => Promise.resolve(null),
  },
  user: {
    findFirst: () => Promise.resolve(null),
  },
}

// Check if we're in build time
export const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL

export function getDbClient() {
  if (isBuildTime) {
    return buildTimeDb as any
  }
  
  // Dynamic import to avoid issues during build
  const { PrismaClient } = require('@prisma/client')
  return new PrismaClient()
}
