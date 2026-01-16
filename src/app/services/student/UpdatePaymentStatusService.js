const errorFactory = require('../../../domain/error/ErrorFactory');
const EnumPaymentStatus = require('../../../domain/enum/EnumPaymentStatus');

module.exports = ({ productRepository, studentRepository, exception }) => ({
    execute: async (body, student_id, product_id) => {
        console.log('updateProduct - product_id: ', product_id);
        try {

            const productQuery = {
                where: {
                    product_id: product_id
                }
            };

            const studentQuery = {
                where: {
                    student_id: student_id
                }
            };

            const product = await productRepository.findOneProduct(productQuery);
            const student = await studentRepository.findOneStudent(studentQuery);

            if (!product || !student) {
                throw exception.notFound(errorFactory([
                    `product or student not found with this product_id ${product_id} and this student_id ${student_id}`,
                    `product or student not found with this product_id ${product_id} and this student_id ${student_id}`
                ]));
            }
                    
            const currentPayersList = {
                payers_list: product.payers_list ? product.payers_list : []
            };

            const currentProductList = {
                product_list: student.product_list
            };

            currentProductList.product_list.forEach(studentProduct => {
                if (studentProduct.product_id === product_id) {
                    if (studentProduct.status !== EnumPaymentStatus.PAID || studentProduct.status !== EnumPaymentStatus.ISENTO) {
                        if ( body.status === EnumPaymentStatus.PAID) {
                            studentProduct.status = EnumPaymentStatus.PAID;
                        }
                        if (body.status === EnumPaymentStatus.ISENTO) {
                            studentProduct.status = EnumPaymentStatus.ISENTO;
                        }
                    }
                    else{
                        throw exception.business(errorFactory([
                            `Payment status cannot be changed from PAID or ISENTO to another status.`,
                            `Payment status cannot be changed from PAID or ISENTO to another status.`
                        ]));
                    }
                }
            });

            currentPayersList.payers_list.forEach(studentPayer => {
                if (studentPayer.student_id === student_id) {
                    if (studentPayer.status !== EnumPaymentStatus.PAID || studentPayer.status !== EnumPaymentStatus.ISENTO) {
                        if ( body.status === EnumPaymentStatus.PAID) {
                            studentPayer.status = EnumPaymentStatus.PAID;
                        }
                        if (body.status === EnumPaymentStatus.ISENTO) {
                            studentPayer.status = EnumPaymentStatus.ISENTO;
                        }
                    }
                    else{
                        throw exception.business(errorFactory([
                            `Payment status cannot be changed from PAID or ISENTO to another status.`,
                            `Payment status cannot be changed from PAID or ISENTO to another status.`
                        ]));
                    }
                }
            });

            const formattedStudentBody = { ...student, ...currentProductList };
            const formattedProductBody = { ...product, ...currentPayersList };

            await studentRepository.updateStudent(formattedStudentBody, studentQuery);
            await productRepository.updateProduct(formattedProductBody, productQuery);

            const updatedStudent = await studentRepository.findOneStudent(studentQuery);
            return updatedStudent;

        } catch (error) {
            console.log('updateProduct - product_id:', product_id, ' - [Error]: ', error);
            throw error;
        }
    }
});