import {
  validateCnpj,
  validateCpf,
  validateCpfOrCnpj,
  validateDate,
  validateLettersSpaces,
  validatePhone,
  validateUsername,
} from './validators';

// Check digits verified by hand, not produced by the functions under test —
// otherwise the tests would only be validating themselves.
const VALID_CPF = '52998224725';
const VALID_CPF_MASKED = '529.982.247-25';
const VALID_CNPJ = '11222333000181';
const VALID_CNPJ_MASKED = '11.222.333/0001-81';

describe('validateCpf', () => {
  it('accepts a valid CPF with and without mask', () => {
    expect(validateCpf(VALID_CPF)).toBe(true);
    expect(validateCpf(VALID_CPF_MASKED)).toBe(true);
  });

  it('rejects a wrong check digit', () => {
    expect(validateCpf('52998224726')).toBe(false);
    expect(validateCpf('52998224715')).toBe(false);
  });

  it('rejects all-repeated digits', () => {
    expect(validateCpf('11111111111')).toBe(false);
    expect(validateCpf('00000000000')).toBe(false);
  });

  it('rejects an incorrect length', () => {
    expect(validateCpf('529982247')).toBe(false);
    expect(validateCpf('529982247250')).toBe(false);
    expect(validateCpf('')).toBe(false);
  });
});

describe('validateCnpj', () => {
  it('accepts a valid CNPJ with and without mask', () => {
    expect(validateCnpj(VALID_CNPJ)).toBe(true);
    expect(validateCnpj(VALID_CNPJ_MASKED)).toBe(true);
  });

  it('rejects a wrong check digit', () => {
    expect(validateCnpj('11222333000182')).toBe(false);
    expect(validateCnpj('11222333000191')).toBe(false);
  });

  it('rejects all-repeated digits', () => {
    expect(validateCnpj('11111111111111')).toBe(false);
  });

  it('rejects an incorrect length and empty input', () => {
    expect(validateCnpj('112223330001')).toBe(false);
    expect(validateCnpj('')).toBe(false);
  });
});

describe('validateCpfOrCnpj', () => {
  it('accepts either one', () => {
    expect(validateCpfOrCnpj(VALID_CPF)).toBe(true);
    expect(validateCpfOrCnpj(VALID_CNPJ)).toBe(true);
  });

  it('rejects when neither is valid', () => {
    expect(validateCpfOrCnpj('12345678900')).toBe(false);
  });
});

describe('validateDate', () => {
  it('accepts a valid dd/MM/yyyy date', () => {
    expect(validateDate('25/12/2024')).toBe(true);
    expect(validateDate('29/02/2024')).toBe(true);
  });

  it('rejects an invalid format', () => {
    expect(validateDate('2024-12-25')).toBe(false);
    expect(validateDate('25/12/24')).toBe(false);
    expect(validateDate('')).toBe(false);
  });

  it('rejects a date that does not exist in the calendar', () => {
    expect(validateDate('31/02/2024')).toBe(false);
    expect(validateDate('29/02/2023')).toBe(false);
  });

  it('treats the year bounds as exclusive', () => {
    expect(validateDate('01/01/2010', 2000, 2020)).toBe(true);
    // A year equal to the bound is rejected (`<=` / `>=` in the
    // implementation). Documented here on purpose.
    expect(validateDate('01/01/2000', 2000, 2020)).toBe(false);
    expect(validateDate('01/01/2020', 2000, 2020)).toBe(false);
  });
});

describe('validatePhone', () => {
  it('accepts an 11-digit mobile number starting with 9', () => {
    expect(validatePhone('11987654321')).toBe(true);
  });

  it('accepts a 10-digit landline number', () => {
    expect(validatePhone('1133334444')).toBe(true);
  });

  it('rejects an 11-digit number that does not start with 9', () => {
    expect(validatePhone('11887654321')).toBe(false);
  });

  it('rejects an invalid area code', () => {
    expect(validatePhone('0987654321')).toBe(false);
  });

  it('rejects repeated digits and an invalid length', () => {
    expect(validatePhone('11111111111')).toBe(false);
    expect(validatePhone('119876543')).toBe(false);
  });

  it('rejects undefined', () => {
    expect(validatePhone(undefined)).toBe(false);
  });
});

describe('validateLettersSpaces', () => {
  it('accepts accented letters and spaces', () => {
    expect(validateLettersSpaces('João da Silva')).toBe(true);
  });

  it('rejects numbers', () => {
    expect(validateLettersSpaces('João 123')).toBe(false);
  });

  it('only accepts a hyphen when explicitly allowed', () => {
    expect(validateLettersSpaces('Ana-Maria')).toBe(false);
    expect(validateLettersSpaces('Ana-Maria', true)).toBe(true);
  });

  it('treats empty text as valid', () => {
    expect(validateLettersSpaces(undefined)).toBe(true);
    expect(validateLettersSpaces('')).toBe(true);
  });
});

describe('validateUsername', () => {
  it('accepts letters, numbers, dot and underscore', () => {
    expect(validateUsername('user.name_01')).toBe(true);
  });

  it('rejects spaces and symbols', () => {
    expect(validateUsername('user name')).toBe(false);
    expect(validateUsername('user@name')).toBe(false);
  });
});
