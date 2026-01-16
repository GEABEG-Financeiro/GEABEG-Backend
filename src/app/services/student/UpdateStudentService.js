const errorFactory = require('../../../domain/error/ErrorFactory');

module.exports = ({ studentRepository, exception }) => ({
    execute: async (body, student_id) => {
        console.log('updateStudent - student_id: ', student_id);
        try {
            const query = {
                where: {
                    student_id: student_id
                }
            };
            const student = await studentRepository.findOneStudent(query);

            if (!student) {
                throw exception.notFound(errorFactory([
                    `Student not found with this student_id ${student_id}`,
                    `Student not found with this student_id ${student_id}`
                ]));
            }

            const formattedBody = { ...student, ...body };

            await studentRepository.updateStudent(formattedBody, query);
            const updatedStudent = await studentRepository.findOneStudent(query);
            return updatedStudent;

        } catch (error) {
            console.log('updateStudent - student_id:', student_id, ' - [Error]: ', error);
            throw error;
        }
    }
});
