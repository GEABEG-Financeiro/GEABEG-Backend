module.exports = ({ container }) => {
    const { studentController, studentSchema } = container.cradle;

    return [
        {
            method: 'post',
            path: '/students',
            middlewares: [],
            tags: ['student'],
            validation: {
                body: studentSchema.createStudentBodySchema.body
            },
            handler: studentController.createStudent
        },
        {
            method: 'put',
            path: '/students/:student_id',
            tags: ['student'],
            validation: {
                body: studentSchema.updateStudentBodySchema.body,
                params: studentSchema.updateStudentParamsSchema.params
            },
            handler: studentController.updateStudent
        },

        {
            method: 'patch',
            path: '/students/:student_id/payments/status',
            tags: ['student'],
            validation: {
                params: studentSchema.updateStudentStatusParamsSchema.params,
                body: studentSchema.updateStudentStatusBodySchema.body,
                headers: studentSchema.updateStudentStatusHeadersSchema.headers
            },
            handler: studentController.updatePaymentStatus
        },

        {
            method: 'patch',
            path: '/students/:student_id/payments/remove',
            tags: ['student'],
            validation: {
                params: studentSchema.updateStudentStatusParamsSchema.params,
                headers: studentSchema.updateStudentStatusHeadersSchema.headers
            },
            handler: studentController.removeStudentProduct
        },


        {
            method: 'delete',
            path: '/students/:student_id',
            tags: ['student'],
            validation: {
                params: studentSchema.deleteStudentParamsSchema.params
            },
            handler: studentController.deleteStudent
        },

        {
            method: 'get',
            path: '/students/:student_id',
            tags: ['student'],
            validation: {
                params: studentSchema.getStudentByIdParamsSchema.params
            },
            handler: studentController.retrieveStudentById
        },
        {
            method: 'get',
            path: '/students',
            tags: ['student'],
            validation: {
                query: studentSchema.getStudentQuerySchema.query
            },
            handler: studentController.retrieveStudent
        }
    ];
};
