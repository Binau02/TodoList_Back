const jwt = require('jsonwebtoken');

/**
 * Verify that the user token is valid. Send http status code `401` if user is not connected.
 *
 * @param req
 * @param res
 * @param next
 */
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({error: 'Access denied'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userEmail = decoded.userEmail;
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid token'});
    }
}

/**
 * Verify that the user token is valid and that he has access to the requested chat. A user has access to a chat if he
 * is part of this chat or if he is an admin. Send http status code `401` if user doesn't have access to the requested chat
 *
 * @param req
 * @param res
 * @param next
 */
async function verifyUserHaveAccessToChat(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({error: 'Access denied'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const {chat_id} = req.params;

        if (!chat_id) {
            return res.status(404).json({message: 'Error - parameter chat_id is undefined'});
        }

        const chat = await chatService.getChatById(chat_id);

        if (chat === null) {
            return res.status(404).json({message: 'Error - chat does not exist in database'});
        }

        req.chat_id = chat_id; // Save chat_id for subroutes

        if (chat.user_email1 === decoded.userEmail || chat.user_email2 === decoded.userEmail) {
            // User of the chat is allowed to see this chat
            req.userEmail = decoded.userEmail;
            next();
        } else if (decoded.userRole && `${decoded.userRole}` === constant.ADMIN_ROLE_ID) {
            // Admin is allowed to see the chats of all users
            req.userEmail = decoded.userEmail;
            req.isLoggedInAsAdmin = true // Save this information to add an alert when an admin is logged in in a chat but not a member of this chat
            next();
        } else {
            return res.status(401).json({error: 'Access denied'});
        }
    } catch (error) {
        res.status(401).json({error: 'Invalid token'});
    }
}

module.exports = {
    verifyToken,
    verifyUserHaveAccessToChat,
};
