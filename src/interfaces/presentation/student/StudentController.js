const AsyncMiddleware = require('../../middlewares/AsyncMiddleware');

module.exports = () => ({

    retrieveStudentById: AsyncMiddleware(async (ctx) => {
        const { retrieveStudentByIdOperation, httpConstants } = ctx.container.cradle;

        const { student_id } = ctx.params;

        const studentFound = await retrieveStudentByIdOperation.execute(student_id);

        return ctx.res.status(httpConstants.OK).json(studentFound);
    }),

    createStudent: AsyncMiddleware(async (ctx) => {
        const { createStudentOperation, httpConstants } = ctx.container.cradle;

        const { body: transactionData } = ctx;
        const { user_id } = ctx.headers;

        const createdStudent = await createStudentOperation.execute(transactionData, user_id);

        return ctx.res.status(httpConstants.CREATED).json(createdStudent);
    }),

    retrieveStudent: AsyncMiddleware(async (ctx) => {
        const { retrieveStudentOperation, httpConstants } = ctx.container.cradle;

        const studentsRetrieved = await retrieveStudentOperation.execute(ctx.query);

        console.log(studentsRetrieved);

        return ctx.res.status(httpConstants.OK).json(studentsRetrieved);
    }),

    updateStudent: AsyncMiddleware(async (ctx) => {
        const { updateStudentOperation, httpConstants } = ctx.container.cradle;
        const { student_id } = ctx.params;
        const { body: transactionData } = ctx;

        const studentRetrieved = await updateStudentOperation.execute(transactionData, student_id);

        return ctx.res.status(httpConstants.OK).json(studentRetrieved);
    }),

    updatePaymentStatus: AsyncMiddleware(async (ctx) => {
        const { updatePaymentStatusOperation, httpConstants } = ctx.container.cradle;
        const { student_id } = ctx.params;
        const { product_id } = ctx.headers;
        const { body: transactionData } = ctx;

        const studentRetrieved = await updatePaymentStatusOperation.execute(transactionData, student_id, product_id);

        return ctx.res.status(httpConstants.OK).json(studentRetrieved);
    }),

    
    removeStudentProduct: AsyncMiddleware(async (ctx) => {
        const { removeStudentProductOperation, httpConstants } = ctx.container.cradle;
        const { student_id } = ctx.params;
        const { product_id } = ctx.headers;

        const studentRetrieved = await removeStudentProductOperation.execute(student_id, product_id);

        return ctx.res.status(httpConstants.OK).json(studentRetrieved);
    }),

    deleteStudent: AsyncMiddleware(async (ctx) => {
        const { deleteStudentOperation, httpConstants } = ctx.container.cradle;
        const { student_id } = ctx.params;

        await deleteStudentOperation.execute(student_id);

        return ctx.res.status(httpConstants.OK).json({});
    })
});
