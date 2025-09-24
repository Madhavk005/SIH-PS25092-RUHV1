#!/usr/bin/env node

/**
 * Simple test runner for the mental health application
 * This script runs tests and provides a summary of results
 */

const { execSync } = require('child_process')
const path = require('path')

console.log('🧠 Mental Health App - Test Runner')
console.log('==================================\n')

try {
  // Check if we're in the right directory
  const packageJsonPath = path.join(__dirname, 'package.json')
  console.log(`📁 Working directory: ${__dirname}`)
  console.log(`📄 Package.json found: ${require('fs').existsSync(packageJsonPath)}\n`)

  console.log('🧪 Running tests...\n')

  // Run Jest tests
  const testOutput = execSync('npm test -- --passWithNoTests --verbose', {
    encoding: 'utf8',
    cwd: __dirname
  })

  console.log(testOutput)

  // Parse test results
  const lines = testOutput.split('\n')
  const summaryLine = lines.find(line => line.includes('Tests:'))
  const passedLine = lines.find(line => line.includes('Passing:'))
  const failedLine = lines.find(line => line.includes('Failing:'))

  if (summaryLine) {
    console.log('\n📊 Test Summary:')
    console.log(summaryLine.trim())
    if (passedLine) console.log(passedLine.trim())
    if (failedLine) console.log(failedLine.trim())
  }

  console.log('\n✅ Test run completed successfully!')

} catch (error) {
  console.error('❌ Test run failed:')
  console.error(error.stdout || error.message)

  if (error.stderr) {
    console.error('\n🔍 Error details:')
    console.error(error.stderr)
  }

  process.exit(1)
}
