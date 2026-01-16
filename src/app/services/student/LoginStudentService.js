const jwt = require("jsonwebtoken");
const errorFactory = require('../../../domain/error/ErrorFactory');

const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = process.env;

module.exports = ({ studentRepository, exception }) => ({
    execute: async (body) => {
        try {
            const { email, password } = body;

            const student = await studentRepository.findOneStudent({ where: { email: email } });

            if (student) {
                const isSame = password === student.password ? true : false;

                if (isSame) {
                    const accessToken = jwt.sign(
                        { role: student.role, student_id: student.student_id },
                        ACCESS_TOKEN_SECRET,
                        { expiresIn: ACCESS_TOKEN_EXPIRY }
                    );

                    const refreshToken = jwt.sign(
                        { role: student.role, student_id: student.student_id },
                        REFRESH_TOKEN_SECRET,
                        { expiresIn: REFRESH_TOKEN_EXPIRY }
                    );

                    const longinBody = {
                        token: accessToken,
                        refreshToken: refreshToken
                    };
                    return longinBody;
                } else {
                    throw exception.unauthorized(errorFactory([
                        'Incorrect Password',
                        'Incorrect Password'
                    ]));
                }
            } else {
                throw exception.notFound(errorFactory([
                    'Student not found',
                    'Student not found'
                ]));
            }
        } catch (error) {
            console.log('login - [Error]: ', error);
            throw error;
        }
    }
});
