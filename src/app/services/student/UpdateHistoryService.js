const errorFactory = require('../../../domain/error/ErrorFactory');

module.exports = ({ userRepository, exception }) => ({
    execute: async (history, user_id) => {
        try {
            const query = {
                where: {
                    user_id: user_id
                }
            };
            const user = await userRepository.findOneUser(query);

            if (!user) {
                throw exception.notFound(errorFactory([
                    `User not found with this user_id ${user_id}`,
                    `User not found with this user_id ${user_id}`
                ]));
            }

            const currentHistory = {
                history: user.history
            };

            if (currentHistory.history === null) {
                currentHistory.history = [];
            }

            currentHistory.history.push(history);

            const formattedBody = { ...user, ...currentHistory };

            await userRepository.updateUser(formattedBody, query);
            const updatedUser = await userRepository.findOneUser(query);
            return updatedUser;

        } catch (error) {
            console.log('updateUser - user_id:', user_id, ' - [Error]: ', error);
            throw error;
        }
    }
});