const errorFactory = require('../../../domain/error/ErrorFactory');

module.exports = ({ userRepository, exception }) => ({
    execute: async (schedule, user_id, register_id) => {
        console.log('updateUser - user_id: ', user_id);
        try {
            const query = {
                where: {
                    user_id: user_id
                },
                plain: true
            };
            const user = await userRepository.findOneUser(query);

            if (!user) {
                throw exception.notFound(errorFactory([
                    `User not found with this user_id ${user_id}`,
                    `User not found with this user_id ${user_id}`
                ]));
            }

            let currentSchedule = {
                current_schedule: user.current_schedule
            };

            if(register_id){
                let newCurrent = [];
                for (const element of currentSchedule.current_schedule) {
                    if(element.register_id !== register_id){
                        newCurrent.push(element);
                    }
                }
                currentSchedule.current_schedule = newCurrent;
            }
            else{
                if (currentSchedule.current_schedule === null) {
                    currentSchedule.current_schedule = [];    
                }
    
                currentSchedule.current_schedule.push(schedule);
            }

            const formattedBody = { ...user, ...currentSchedule };

            await userRepository.updateUser(formattedBody, query);
            const updatedUser = await userRepository.findOneUser(query);
            return updatedUser;

        } catch (error) {
            console.log('updateUser - user_id:', user_id, ' - [Error]: ', error);
            throw error;
        }
    }
});