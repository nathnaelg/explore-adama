/**
 * Validates a password against strong security requirements.
 * Requirements:
 * - At least 6 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * 
 * @param password The password string to validate
 * @returns An object containing `isValid` boolean and an optional `error` message string
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
    if (!password) {
        return { isValid: false, error: 'Password is required' };
    }

    if (password.length < 6) {
        return { isValid: false, error: 'Password must be at least 6 characters long' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
        return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }

    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) {
        return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }

    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) {
        return { isValid: false, error: 'Password must contain at least one number' };
    }

    return { isValid: true };
};
