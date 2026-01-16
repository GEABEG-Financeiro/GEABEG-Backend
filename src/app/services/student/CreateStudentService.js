
const { v4: uuidv4 } = require('uuid');

module.exports = ({ studentRepository }) => ({
    execute: async (body) => {
        try {
            body.student_id = uuidv4();

            const createdStudent = await studentRepository.createStudent(body);

            if (createdStudent) {
                console.log("student", JSON.stringify(createdStudent, null, 2));
                return createdStudent;
            }
        } catch (error) {
            console.log('createStudent - [Error]: ', error);
            throw error;
        }
    }
});
