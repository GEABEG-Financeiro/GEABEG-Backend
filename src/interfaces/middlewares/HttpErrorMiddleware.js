
module.exports = ({ container }) => (err, req, res, next) => {
    const { httpErrorWrapper } = container.cradle;

    console.log(err);

    const errorWrapper = httpErrorWrapper(err);

    const {
        status_code,
        message,
    } = errorWrapper(err);

    console.log(err);
    return res.status(status_code).json({
        code: err.code,
        message,
        details: err.details || [],
    });
};