import { POST } from './route'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      status: options?.status || 200,
      json: async () => data,
      text: async () => JSON.stringify(data),
      ok: true,
    })),
  },
}))

// Create a simple NextRequest mock
const createNextRequest = (url: string, options: any = {}) => ({
  json: async () => options.body ? JSON.parse(options.body) : {},
})

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('successfully forwards login request to backend', async () => {
    const mockResponse = {
      token: 'mock-jwt-token',
      user: { id: '1', email: 'test@example.com' }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    })

    const request = createNextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
      headers: {
        'content-type': 'application/json',
      },
    }) as any

    const response = await POST(request)
    const data = await response.json()

    expect(mockFetch).toHaveBeenCalledWith(
      'https://ai-therapist-agent-backend.onrender.com/auth/login',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        }),
      })
    )

    expect(response.status).toBe(200)
    expect(data).toEqual(mockResponse)
  })

  it('handles backend API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials' }),
    })

    const request = createNextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      }),
      headers: {
        'content-type': 'application/json',
      },
    }) as any

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data).toEqual({ message: 'Invalid credentials' })
  })

  it('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const request = createNextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
      headers: {
        'content-type': 'application/json',
      },
    }) as any

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      message: 'Server error',
      error: expect.any(Error)
    })
  })

  it('uses custom backend URL when provided', async () => {
    process.env.BACKEND_API_URL = 'http://localhost:8000'

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    })

    const request = createNextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
      headers: {
        'content-type': 'application/json',
      },
    }) as any

    await POST(request)

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/login',
      expect.any(Object)
    )

    // Clean up
    delete process.env.BACKEND_API_URL
  })
})
