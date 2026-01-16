const errorFactory = require('../../../domain/error/ErrorFactory');
const EnumPaymentStatus = require('../../../domain/enum/EnumPaymentStatus');

module.exports = ({ productRepository, studentRepository, exception }) => ({
    execute: async (student_id, product_id) => {
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
            const updatedProductList = {
                product_list: student.product_list.filter(p => p.product_id !== product_id)
            };

            if (updatedProductList.product_list.length === student.product_list.length) {
                throw exception.notFound(errorFactory([
                    `product ${product_id} not found in student's product_list`,
                    `product ${product_id} not found in student's product_list`
                ]));
            }

            const updatedPayerList = {
                payers_list: product.payers_list.filter(p => p.student_id !== student_id)
            }

            if (updatedPayerList.payers_list.length === student.product_list.length) {
                throw exception.notFound(errorFactory([
                    `student ${student_id} not found in product's payer_list`,
                    `student ${student_id} not found in product's payer_list`
                ]));
            }

            const formattedStudentBody = { ...student, ...updatedProductList };
            const formattedProductBody = { ...product, ...updatedPayerList };

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