# Testing Rules

- Each exercise.test.ts verifies:
  1. Schema loads without errors
  2. Solution returns expected results for all test cases
  3. At least one wrong answer is rejected
- Each test case resets schema (DROP + recreate)
- No shared state between test cases
- Use vitest describe/it/expect
