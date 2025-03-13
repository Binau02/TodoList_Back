const userService = require('../service/userService');

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

/**
 * Verify that the given email format is valid.
 *
 * @param email the email to verify
 * @returns whether the email has a valid format or not
 */
async function emailIsValid(email) {
    return EMAIL_REGEX.test(email);
}

/**
 * Verify that the given email is not already used.
 *
 * @param email the email to verify (`null` = do not check email)
 * @returns whether the email and the username are available or not
 */
async function emailIsAlreadyUsed(email) {
    const registeredUsers = await userService.getAllUsers();
    return registeredUsers.some((user) => user.email === email);
}

module.exports = {
    emailIsValid,
    emailIsAlreadyUsed,
}