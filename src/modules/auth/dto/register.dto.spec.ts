import { validateSync } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto password validation', () => {
  const isValid = (password: unknown) => {
    const dto = Object.assign(new RegisterDto(), {
      name: 'Test',
      email: 'test@example.com',
      password,
    });
    return validateSync(dto).length === 0;
  };

  it.each(['Abc123!@', 'Aa1!aaaa'])(
    'accepts a valid password with exactly 8 characters',
    (password) => expect(isValid(password)).toBe(true),
  );

  it.each([
    'Aa1!aaa',
    'Aa1!aaaaa',
    'Aa1!' + 'a'.repeat(61),
    'abc123!@',
    'ABC123!@',
    'Abcdef!@',
    'Abc12345',
    'Abc1234 ',
    '        ',
    '\t\n      ',
    '',
    undefined,
    12345678,
  ])('rejects passwords that violate the policy', (password) => {
    expect(isValid(password)).toBe(false);
  });
});
