const errorFactory = require('../../../domain/error/ErrorFactory');

module.exports = ({ studentRepository, exception }) => ({
    execute: async (student_id) => {
        try {
            const query = {
                where: { student_id: student_id }
            };
            const student = await studentRepository.findOneStudent(query);

            if (!student) {
                throw exception.notFound(errorFactory([
                    `Student not found with this student_id ${student_id}`,
                    `Student not found with this student_id ${student_id}`
                ]));
            } else {
                await studentRepository.deleteStudent(student);
            }
        } catch (error) {
            console.log('deleteStudent - student_id:', student_id, ' - [Error]: ', error);
            throw error;
        }
    }
});