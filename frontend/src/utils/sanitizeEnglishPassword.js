/**
 * Vietnamese Telex & International diacritics to English ASCII sanitizer.
 * Ensures password fields only receive valid English ASCII characters,
 * automatically converting Telex-accented characters back to original keystrokes
 * even when the user is typing with Unikey, EVKey, or OS Vietnamese IME active.
 */

const VIETNAMESE_TELEX_TO_ENGLISH = {
  // Lowercase single tone vowels
  'á': 'as', 'à': 'af', 'ả': 'ar', 'ã': 'ax', 'ạ': 'aj',
  'é': 'es', 'è': 'ef', 'ẻ': 'er', 'ẽ': 'ex', 'ẹ': 'ej',
  'í': 'is', 'ì': 'if', 'ỉ': 'ir', 'ĩ': 'ix', 'ị': 'ij',
  'ó': 'os', 'ò': 'of', 'ỏ': 'or', 'õ': 'ox', 'ọ': 'oj',
  'ú': 'us', 'ù': 'uf', 'ủ': 'ur', 'ũ': 'ux', 'ụ': 'uj',
  'ý': 'ys', 'ỳ': 'yf', 'ỷ': 'yr', 'ỹ': 'yx', 'ỵ': 'yj',
  'đ': 'dd',

  // Lowercase modified vowels
  'â': 'aa', 'ă': 'aw',
  'ê': 'ee',
  'ô': 'oo', 'ơ': 'ow',
  'ư': 'w',

  // Lowercase compound: modified vowel + tone mark
  'ấ': 'aas', 'ầ': 'aaf', 'ẩ': 'aar', 'ẫ': 'aax', 'ậ': 'aaj',
  'ắ': 'aws', 'ằ': 'awf', 'ẳ': 'awr', 'ẵ': 'awx', 'ặ': 'awj',
  'ế': 'ees', 'ề': 'eef', 'ể': 'eer', 'ễ': 'eex', 'ệ': 'eej',
  'ố': 'oos', 'ồ': 'oof', 'ổ': 'oor', 'ỗ': 'oox', 'ộ': 'ooj',
  'ớ': 'ows', 'ờ': 'owf', 'ở': 'owr', 'Ỡ': 'owx', 'ợ': 'owj',
  'ứ': 'ws',  'ừ': 'wf',  'ử': 'wr',  'ữ': 'wx',  'ự': 'wj',

  // Uppercase single tone vowels
  'Á': 'As', 'À': 'Af', 'Ả': 'Ar', 'Ã': 'Ax', 'Ạ': 'Aj',
  'É': 'Es', 'È': 'Ef', 'Ẻ': 'Er', 'Ẽ': 'Ex', 'Ẹ': 'Ej',
  'Í': 'Is', 'Ì': 'If', 'Ỉ': 'Ir', 'Ĩ': 'Ix', 'Ị': 'Ij',
  'Ó': 'Os', 'Ò': 'Of', 'Ỏ': 'Or', 'Õ': 'Ox', 'Ọ': 'Oj',
  'Ú': 'Us', 'Ù': 'Uf', 'Ủ': 'Ur', 'Ũ': 'Ux', 'Ụ': 'Uj',
  'Ý': 'Ys', 'Ỳ': 'Yf', 'Ỷ': 'Yr', 'Ỹ': 'Yx', 'Ỵ': 'Yj',
  'Đ': 'Dd',

  // Uppercase modified vowels
  'Â': 'Aa', 'Ă': 'Aw',
  'Ê': 'Ee',
  'Ô': 'Oo', 'Ơ': 'Ow',
  'Ư': 'W',

  // Uppercase compound: modified vowel + tone mark
  'Ấ': 'Aas', 'Ầ': 'Aaf', 'Ẩ': 'Aar', 'Ẫ': 'Aax', 'Ậ': 'Aaj',
  'Ắ': 'Aws', 'Ằ': 'Awf', 'Ẳ': 'Awr', 'Ẵ': 'Awx', 'Ặ': 'Awj',
  'Ế': 'Ees', 'Ề': 'Eef', 'Ể': 'Eer', 'Ễ': 'Eex', 'Ệ': 'Eej',
  'Ố': 'Oos', 'Ồ': 'Oof', 'Ổ': 'Oor', 'Ỗ': 'Oox', 'Ộ': 'Ooj',
  'Ớ': 'Ows', 'Ờ': 'Owf', 'Ở': 'Owr', 'Ỡ': 'Owx', 'Ợ': 'Owj',
  'Ứ': 'Ws',  'Ừ': 'Wf',  'Ử': 'Wr',  'Ữ': 'Wx',  'Ự': 'Wj',
};

/**
 * Converts any Vietnamese IME or foreign input into clean English ASCII characters.
 *
 * @param {string} input - The raw input string
 * @returns {string} - Clean ASCII string with restored English keystrokes
 */
export function sanitizeEnglishPassword(input) {
  if (!input) return '';

  let converted = '';
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (VIETNAMESE_TELEX_TO_ENGLISH[char]) {
      converted += VIETNAMESE_TELEX_TO_ENGLISH[char];
    } else {
      converted += char;
    }
  }

  // Fallback: strip any remaining combining diacritic marks
  converted = converted.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Strictly enforce printable ASCII characters (space to tilde: 0x20 - 0x7E)
  return converted.replace(/[^\x20-\x7E]/g, '');
}
