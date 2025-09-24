import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock environment variables
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'

// Global test utilities
global.fetch = jest.fn()

// Mock Web APIs for Next.js API routes
global.Request = jest.fn().mockImplementation((url, options) => ({
  url,
  method: options?.method || 'GET',
  headers: new Headers(options?.headers),
  body: options?.body,
  json: jest.fn().mockImplementation(async () => JSON.parse(options?.body || '{}')),
}))

global.Response = jest.fn().mockImplementation((body, options) => ({
  status: options?.status || 200,
  statusText: options?.statusText || 'OK',
  headers: new Headers(options?.headers),
  body,
  json: jest.fn().mockImplementation(async () => JSON.parse(body)),
  text: jest.fn().mockImplementation(async () => body),
}))

// Mock Next.js Response for API routes
global.NextResponse = {
  json: jest.fn((data, options) => {
    const response = {
      status: options?.status || 200,
      json: async () => data,
      text: async () => JSON.stringify(data),
      headers: new Headers(),
      ok: true,
    }
    return response
  }),
}
