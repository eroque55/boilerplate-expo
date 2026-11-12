import {
  cleanMessage,
  formatCurrency,
  formatDateToEnUs,
  formatDateToPtBr,
  matchText,
  normalize,
  normalizeSearch,
} from './format';

describe('normalize', () => {
  it('strips every non-digit character', () => {
    expect(normalize('123.456.789-00')).toBe('12345678900');
    expect(normalize('(11) 98888-7777')).toBe('11988887777');
  });

  it('returns an empty string when there are no digits', () => {
    expect(normalize('abc')).toBe('');
  });
});

describe('formatCurrency', () => {
  it('formats as BRL with two decimal places', () => {
    // ICU separates "R$" from the number with a non-breaking space (U+00A0),
    // so the assertion normalizes whitespace instead of comparing literally.
    expect(formatCurrency(1234.5).replace(/\s/g, ' ')).toBe('R$ 1.234,50');
    expect(formatCurrency(0).replace(/\s/g, ' ')).toBe('R$ 0,00');
  });
});

describe('date conversion', () => {
  it('converts pt-BR to ISO', () => {
    expect(formatDateToEnUs('25/12/2024')).toBe('2024-12-25');
  });

  it('converts ISO to pt-BR', () => {
    expect(formatDateToPtBr('2024-12-25')).toBe('25/12/2024');
  });

  it('returns an empty string when the date is undefined', () => {
    expect(formatDateToPtBr(undefined)).toBe('');
  });

  it('round-trips without losing the value', () => {
    expect(formatDateToPtBr(formatDateToEnUs('01/02/2003'))).toBe('01/02/2003');
  });
});

describe('normalizeSearch', () => {
  it('strips accents and lowercases', () => {
    expect(normalizeSearch('João Ção ÁÉÍÓÚ')).toBe('joao cao aeiou');
  });
});

describe('matchText', () => {
  it('matches ignoring accents and case', () => {
    expect(matchText('João da Silva', 'joao')).toBe(true);
    expect(matchText('João da Silva', 'JOÃO')).toBe(true);
  });

  it('returns false when there is no match', () => {
    expect(matchText('João da Silva', 'pedro')).toBe(false);
  });
});

describe('cleanMessage', () => {
  it('trims trailing spaces and collapses extra line breaks', () => {
    expect(cleanMessage('linha\n\n\n\nfim   ')).toBe('linha\n\nfim');
  });

  it('returns an empty string when the message is undefined', () => {
    expect(cleanMessage(undefined)).toBe('');
  });
});
