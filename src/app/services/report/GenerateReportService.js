const moment = require('moment');
const PdfReportGenerator = require('../../utils/PdfReportGenerator');
const { Op } = require('sequelize');

module.exports = ({ productRepository }) => {
    return {
        execute: async (body) => {
            try {
                const { start_date, end_date } = body;

                // Buscar produtos no período
                const products = await productRepository.findAllProduct({
                    start_date: {
                        [Op.gte]: start_date
                    },
                    end_date: {
                        [Op.lte]: end_date
                    }
                });

                // Calcular estatísticas
                let totalAmount = 0;
                let paidCount = 0;
                let exemptCount = 0;
                let pendingCount = 0;
                const studentPayments = new Map();
                const productRevenueList = [];

                products.forEach((product) => {
                    const payers = product.payers_list || [];
                    let productPaidCount = 0;
                    let productRevenue = 0;

                    payers.forEach(payer => {
                        const status = payer.status?.toUpperCase() || payer.status;
                        
                        if (status === 'PAID') {
                            paidCount++;
                            productPaidCount++;
                            const amount = product.price / 100;
                            totalAmount += amount;
                            productRevenue += amount;

                            if (!studentPayments.has(payer.student_id)) {
                                studentPayments.set(payer.student_id, {
                                    name: payer.name,
                                    totalPaid: 0,
                                    paymentCount: 0
                                });
                            }
                            const studentData = studentPayments.get(payer.student_id);
                            studentData.totalPaid += amount;
                            studentData.paymentCount++;
                        } else if (status === 'EXEMPT') {
                            exemptCount++;
                            productPaidCount++;
                        } else if (status === 'PENDING') {
                            pendingCount++;
                        }
                    });

                    productRevenueList.push({
                        name: product.name,
                        totalRevenue: productRevenue,
                        paidCount: productPaidCount
                    });
                });

                const topProducts = productRevenueList
                    .sort((a, b) => b.totalRevenue - a.totalRevenue)
                    .slice(0, 5);

                const studentStats = Array.from(studentPayments.values())
                    .sort((a, b) => b.totalPaid - a.totalPaid);

                const stats = {
                    summary: {
                        totalProducts: products.length,
                        totalAmount,
                        paidCount,
                        exemptCount,
                        pendingCount,
                        averagePerProduct: products.length > 0 ? totalAmount / products.length : 0,
                        totalStudents: studentPayments.size
                    },
                    topProducts,
                    studentStats
                };

                // Gerar PDF
                const pdfGenerator = new PdfReportGenerator();
                pdfGenerator
                    .create()
                    .addHeader(start_date, end_date)
                    .addSummaryBox(stats.summary)
                    .addSection('PRODUTOS NO PERIODO')
                    .addProductsTable(products)
                    .addSection('DESTAQUES')
                    .addTopProducts(stats.topProducts)
                    .addStudentSummary(stats.studentStats)
                    .addFooter();

                const pdfBuffer = await pdfGenerator.getBuffer();

                return {
                    pdf: pdfBuffer.toString('base64'),
                    filename: `relatorio_${moment(start_date).format('YYYYMMDD')}_${moment(end_date).format('YYYYMMDD')}.pdf`,
                    contentType: 'application/pdf',
                    stats: stats.summary
                };

            } catch (error) {
                console.log('generate report - [Error]: ', error);
                throw error;
            }
        }
    };
};
