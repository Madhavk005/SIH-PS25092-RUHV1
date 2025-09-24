# 🧪 Testing Guide for Mental Health Application

This document outlines the testing strategy and setup for the Ruh V1 mental health application.

## 📋 Overview

The application uses **Jest** and **React Testing Library** for comprehensive testing coverage including:

- ✅ Component testing
- ✅ API route testing
- ✅ Authentication flow testing
- ✅ Emergency/SafeNet feature testing
- ✅ User interaction testing

## 🛠️ Testing Stack

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM
- **@testing-library/user-event** - User interaction simulation
- **jest-environment-jsdom** - Browser environment simulation

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and npm installed. The testing dependencies should already be installed.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Using the Test Runner

For a more user-friendly test experience:

```bash
node test-runner.js
```

## 📁 Test Structure

```
Frontend/
├── components/
│   ├── header.test.tsx              # Header component tests
│   └── safenet/
│       └── sos-button.test.tsx      # SOS button tests
├── app/
│   └── api/
│       └── auth/
│           └── login/
│               └── route.test.ts    # API route tests
├── jest.config.js                   # Jest configuration
├── jest.setup.js                    # Test setup and mocks
└── test-runner.js                   # Custom test runner
```

## 🧪 Test Categories

### 1. Component Tests

**Location:** `components/**/*.test.tsx`

**Purpose:** Test individual React components in isolation

**Examples:**
- Rendering components correctly
- User interactions (clicks, form inputs)
- State changes and effects
- Props validation
- Error handling

### 2. API Route Tests

**Location:** `app/api/**/*.test.ts`

**Purpose:** Test Next.js API routes

**Examples:**
- HTTP request/response handling
- Error scenarios
- Authentication middleware
- Data validation
- External API integration

### 3. Integration Tests

**Location:** `__tests__/` directories or `*.integration.test.tsx`

**Purpose:** Test component interactions and data flow

### 4. End-to-End Tests

**Future:** Will be added with Playwright for full user journeys

## 🎯 Key Features Tested

### SafeNet Emergency System
- ✅ SOS button functionality
- ✅ Emergency contact management
- ✅ Location services integration
- ✅ Countdown and alert mechanisms
- ✅ Emergency number dialing

### Authentication System
- ✅ Login/logout flows
- ✅ Session management
- ✅ API route security
- ✅ Error handling

### User Interface
- ✅ Responsive design
- ✅ Theme switching
- ✅ Navigation components
- ✅ Mobile menu functionality

## 🔧 Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/**/*.test.(js|jsx|ts|tsx)',
    '<rootDir>/**/__tests__/**/*.(js|jsx|ts|tsx)',
  ],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}
```

### Test Setup (`jest.setup.js`)

- Global test utilities
- Next.js router mocking
- Environment variable mocking
- Fetch API mocking

## 📊 Coverage Goals

Aim for the following coverage percentages:

- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

## 🐛 Debugging Tests

### Common Issues

1. **Async Operations**
   ```javascript
   // Use waitFor for async operations
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument()
   })
   ```

2. **User Events**
   ```javascript
   // Use user-event for complex interactions
   await userEvent.click(button)
   await userEvent.type(input, 'text')
   ```

3. **Mocking External Dependencies**
   ```javascript
   // Mock navigator.geolocation
   Object.defineProperty(navigator, 'geolocation', {
     value: mockGeolocation,
     writable: true,
   })
   ```

### Debug Mode

```bash
# Run tests with debug output
npm test -- --verbose

# Run specific test file
npm test -- sos-button.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="SOS button"
```

## 🔄 Continuous Integration

The test suite is configured for CI/CD with:

- Coverage reporting
- Parallel test execution
- Failure reporting
- Artifact collection

## 📝 Writing New Tests

### Component Test Template

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { YourComponent } from './your-component'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interaction', () => {
    render(<YourComponent />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(/* expected behavior */).toBeTruthy()
  })
})
```

### API Route Test Template

```javascript
import { POST } from './route'
import { NextRequest } from 'next/server'

describe('/api/your-endpoint', () => {
  it('handles successful requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

## 🎉 Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the component does, not how it does it
   - Avoid testing internal state when possible

2. **Use Descriptive Test Names**
   - `it('should show error message when login fails')`
   - `it('should redirect to dashboard after successful login')`

3. **Keep Tests Isolated**
   - Each test should be independent
   - Use `beforeEach` for common setup
   - Clean up mocks after each test

4. **Test Edge Cases**
   - Empty states
   - Error conditions
   - Loading states
   - Network failures

5. **Use Appropriate Assertions**
   - `toBeInTheDocument()` for element existence
   - `toHaveClass()` for styling
   - `toHaveBeenCalledWith()` for function calls

## 📈 Monitoring and Maintenance

- Regularly review test coverage reports
- Update tests when features change
- Remove obsolete tests
- Monitor test execution time
- Fix flaky tests immediately

## 🆘 Getting Help

If you encounter issues:

1. Check the Jest documentation: https://jestjs.io/docs/getting-started
2. Review React Testing Library docs: https://testing-library.com/docs/react-testing-library/intro
3. Look at existing tests for patterns
4. Check the troubleshooting section above

---

**Happy Testing! 🧠✨**

Remember: Good tests help ensure your mental health application provides reliable support to users when they need it most.
