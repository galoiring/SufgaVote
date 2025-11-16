/**
 * Generate a random alphanumeric code
 * @param {number} length - Length of the code
 * @returns {string} - Random code
 */
export const generateCode = (length = 6) => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous characters
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};

/**
 * Generate a unique code that doesn't exist in the provided set
 * @param {Set} existingCodes - Set of existing codes
 * @param {number} length - Length of the code
 * @returns {string} - Unique code
 */
export const generateUniqueCode = (existingCodes, length = 6) => {
  let code;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    code = generateCode(length);
    attempts++;

    if (attempts >= maxAttempts) {
      throw new Error('Could not generate unique code after maximum attempts');
    }
  } while (existingCodes.has(code));

  return code;
};

export default {
  generateCode,
  generateUniqueCode,
};
