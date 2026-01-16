module.exports = ({ container }) => {
    const {reportController, reportSchema } = container.cradle;

    return [
        {
            method: 'post',
            path: '/reports',
            middlewares: [],
            tags: ['reports'],
            validation: {
                body: reportSchema.generateReportBodySchema.body
            },
            handler: reportController.postReport
        }
    ];
};
