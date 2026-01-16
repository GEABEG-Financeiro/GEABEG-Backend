const errorFactory = require('../../../domain/error/ErrorFactory');

module.exports = ({ studentRepository, exception }) => ({
    execute: async (student_id) => {
        try {

        const studentRetrieved = await studentRepository.findOneStudent({
            where: {
                student_id: student_id
            }
        });

        if (studentRetrieved) {
            if(studentRetrieved?.image){
                let imgBase64 = Buffer.from(studentRetrieved?.image).toString('base64');
                studentRetrieved.image = `data:image/png;base64,${imgBase64}`;
            }
            return studentRetrieved;
        } else {
            throw exception.notFound(errorFactory([
                `Any register not found with the student_id ${student_id}`,
                `Any register not found with the student_id ${student_id}`
            ]));
        }

    } catch(error) {
        console.log('getStudentById - student_id:', student_id, ' - [Error]: ', error);
        throw error;
    }
}
});