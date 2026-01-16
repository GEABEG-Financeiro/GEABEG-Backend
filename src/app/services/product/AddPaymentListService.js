const errorFactory = require('../../../domain/error/ErrorFactory');
const EnumPaymentStatus = require('../../../domain/enum/EnumPaymentStatus');

module.exports = ({ productRepository, studentRepository, exception }) => ({
    execute: async (body, product_id) => {
        console.log('updateProduct - product_id: ', product_id);
        try {
            const productQuery = {
                where: {
                    product_id: product_id
                }
            };

            const product = await productRepository.findOneProduct(productQuery);

            if (!product) {
                throw exception.notFound(errorFactory([
                    `Product not found with this product_id ${product_id}`,
                    `Product not found with this product_id ${product_id}`
                ]));
            }
        
            const currentPayersList = {
                payers_list: product.payers_list ? product.payers_list : []
            };

            for (const payer of body.payers_list) {
                const studentQuery = {
                    where: {
                        student_id: payer.student_id
                    }
                };

                const student = await studentRepository.findOneStudent(studentQuery);
                if (student) {

                    const currentProductList = {
                        product_list: student.product_list
                    };

                    currentProductList.product_list.push({
                        product_id: product.product_id,
                        name: product.name,
                        price: product.price,
                        status: EnumPaymentStatus.PENDING
                    })

                    const formattedBody = { ...student, ...currentProductList };

                    const studentQuery = {
                        where: {
                            student_id: payer.student_id
                        }
                    };

                    await studentRepository.updateStudent(formattedBody, studentQuery);
                }
                currentPayersList.payers_list.push(payer);
            }

            const formattedBody = { ...product, ...currentPayersList };

            await productRepository.updateProduct(formattedBody, productQuery);
            const updatedProduct = await productRepository.findOneProduct(productQuery);
            return updatedProduct;

        } catch (error) {
            console.log('updateProduct - product_id:', product_id, ' - [Error]: ', error);
            throw error;
        }
    }
});