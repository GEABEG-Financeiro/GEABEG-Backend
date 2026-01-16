const PDFDocument = require('pdfkit');
const moment = require('moment');

class PdfReportGenerator {
    constructor() {
        this.doc = null;
        this.currentY = 0;
        // Paleta de cores terra/laranja
        this.colors = {
            primary: '#D2691E',      // Chocolate/Terra
            secondary: '#FF8C00',    // Laranja escuro
            accent: '#CD853F',       // Peru/Terra claro
            background: '#FFF8DC',   // Cornsilk (bege claro)
            darkText: '#4A4A4A',     // Cinza escuro
            lightBg: '#FAEBD7'       // Antique white
        };
    }

    create() {
        this.doc = new PDFDocument({ 
            size: 'A4', 
            margin: 50,
            bufferPages: true
        });
        this.currentY = 50;
        return this;
    }

    addHeader(startDate, endDate) {
        // Background do cabeçalho
        this.doc
            .rect(0, 0, 595, 120)
            .fill(this.colors.primary);

        // Título
        this.doc
            .fontSize(24)
            .font('Helvetica-Bold')
            .fillColor('#FFFFFF')
            .text('RELATORIO DE ARRECADACAO', 50, 30, { align: 'center' })
            .moveDown(0.3);

        // Subtítulo com período
        this.doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Periodo: ${moment(startDate).format('DD/MM/YYYY')} a ${moment(endDate).format('DD/MM/YYYY')}`, { align: 'center' })
            .moveDown(0.5);

        // Data de geração
        this.doc
            .fontSize(9)
            .text(`Gerado em: ${moment().format('DD/MM/YYYY [as] HH:mm')}`, { align: 'center' });

        this.doc.y = 140;
        this.currentY = this.doc.y;
        return this;
    }

    addSection(title) {
        // Background da seção
        this.doc
            .rect(50, this.doc.y, 495, 25)
            .fill(this.colors.accent);

        this.doc
            .fontSize(13)
            .font('Helvetica-Bold')
            .fillColor('#FFFFFF')
            .text(title, 60, this.doc.y + 7);
        
        this.doc.y += 30;
        this.currentY = this.doc.y;
        return this;
    }

    addSummaryBox(data) {
        const boxWidth = 495;
        const boxHeight = 160;
        const startX = 50;
        const startY = this.doc.y;

        // Background gradient effect
        this.doc
            .roundedRect(startX, startY, boxWidth, boxHeight, 8)
            .fill(this.colors.lightBg)
            .stroke();

        // Borda colorida
        this.doc
            .lineWidth(3)
            .strokeColor(this.colors.secondary)
            .roundedRect(startX, startY, boxWidth, boxHeight, 8)
            .stroke();

        // Título do resumo
        this.doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .fillColor(this.colors.primary)
            .text('RESUMO GERAL', startX + 15, startY + 15);

        // Linha divisória
        this.doc
            .strokeColor(this.colors.accent)
            .lineWidth(1)
            .moveTo(startX + 15, startY + 35)
            .lineTo(startX + boxWidth - 15, startY + 35)
            .stroke();

        // Dados em grid
        const dataY = startY + 50;
        const col1X = startX + 25;
        const col2X = startX + 270;
        const rowHeight = 22;

        this.doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor(this.colors.darkText);

        // Coluna 1
        this.doc
            .font('Helvetica-Bold')
            .text('Total de Produtos:', col1X, dataY)
            .font('Helvetica')
            .text(data.totalProducts.toString(), col1X + 140, dataY);

        this.doc
            .font('Helvetica-Bold')
            .text('Pagamentos Confirmados:', col1X, dataY + rowHeight)
            .font('Helvetica')
            .text(data.paidCount.toString(), col1X + 140, dataY + rowHeight);

        this.doc
            .font('Helvetica-Bold')
            .text('Pagamentos Isentos:', col1X, dataY + rowHeight * 2)
            .font('Helvetica')
            .text(data.exemptCount.toString(), col1X + 140, dataY + rowHeight * 2);

        this.doc
            .font('Helvetica-Bold')
            .text('Pagamentos Pendentes:', col1X, dataY + rowHeight * 3)
            .font('Helvetica')
            .text(data.pendingCount.toString(), col1X + 140, dataY + rowHeight * 3);

        // Coluna 2
        this.doc
            .font('Helvetica-Bold')
            .fillColor(this.colors.secondary)
            .text('Total Arrecadado:', col2X, dataY)
            .font('Helvetica')
            .text(`R$ ${data.totalAmount.toFixed(2)}`, col2X + 120, dataY);

        this.doc
            .font('Helvetica-Bold')
            .fillColor(this.colors.darkText)
            .text('Media por Produto:', col2X, dataY + rowHeight)
            .font('Helvetica')
            .text(`R$ ${data.averagePerProduct.toFixed(2)}`, col2X + 120, dataY + rowHeight);

        this.doc
            .font('Helvetica-Bold')
            .text('Total de Alunos:', col2X, dataY + rowHeight * 2)
            .font('Helvetica')
            .text(data.totalStudents.toString(), col2X + 120, dataY + rowHeight * 2);

        this.doc.y = startY + boxHeight + 25;
        this.currentY = this.doc.y;
        return this;
    }

    addProductsTable(products) {
        if (products.length === 0) {
            this.doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor(this.colors.darkText)
                .text('Nenhum produto encontrado no periodo.', { align: 'center' })
                .moveDown(1);
            return this;
        }

        const tableTop = this.doc.y;
        const col1X = 50;
        const col2X = 230;
        const col3X = 360;
        const col4X = 470;

        // Cabeçalho da tabela com background
        this.doc
            .rect(col1X, tableTop - 5, 495, 20)
            .fill(this.colors.background);

        this.doc
            .fontSize(9)
            .font('Helvetica-Bold')
            .fillColor(this.colors.primary)
            .text('PRODUTO', col1X + 5, tableTop)
            .text('TIPO', col2X + 5, tableTop)
            .text('VALOR', col3X + 5, tableTop)
            .text('PAGOS', col4X + 5, tableTop);

        let currentY = tableTop + 25;
        this.doc.font('Helvetica').fontSize(8).fillColor(this.colors.darkText);

        products.forEach((product, index) => {
            if (currentY > 720) {
                this.doc.addPage();
                currentY = 80;
            }

            // Zebra striping
            if (index % 2 === 0) {
                this.doc
                    .rect(col1X, currentY - 3, 495, 18)
                    .fill('#FFFFFF');
            } else {
                this.doc
                    .rect(col1X, currentY - 3, 495, 18)
                    .fill(this.colors.lightBg);
            }

            const payers = product.payers_list || [];
            const paidCount = payers.filter(p => p.status?.toUpperCase() === 'PAID').length || 0;
            const exemptCount = payers.filter(p => p.status?.toUpperCase() === 'EXEMPT').length || 0;
            const totalPayers = payers.length || 0;

            this.doc
                .fillColor(this.colors.darkText)
                .text(this._truncate(product.name, 25), col1X + 5, currentY)
                .text(this._formatType(product.type), col2X + 5, currentY)
                .fillColor(this.colors.secondary)
                .font('Helvetica-Bold')
                .text(`R$ ${(product.price / 100).toFixed(2)}`, col3X + 5, currentY)
                .fillColor(this.colors.darkText)
                .font('Helvetica')
                .text(`${paidCount + exemptCount}/${totalPayers}`, col4X + 5, currentY);

            currentY += 18;
        });

        this.doc.y = currentY + 15;
        this.currentY = this.doc.y;
        return this;
    }

    addTopProducts(topProducts) {
        if (topProducts.length === 0) return this;

        this.doc
            .fontSize(11)
            .font('Helvetica-Bold')
            .fillColor(this.colors.primary)
            .text('TOP 5 PRODUTOS COM MAIOR ARRECADACAO', 50, this.doc.y, { align: 'left' })
            .moveDown(0.8);

        topProducts.forEach((product, index) => {
            const boxY = this.doc.y;
            
            // Medalhinha de posição
            const medalColor = index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : this.colors.accent;
            
            this.doc
                .circle(65, boxY + 7, 10)
                .fill(medalColor);

            this.doc
                .fontSize(8)
                .font('Helvetica-Bold')
                .fillColor('#FFFFFF')
                .text(`${index + 1}`, 62, boxY + 3);

            this.doc
                .fontSize(9)
                .font('Helvetica')
                .fillColor(this.colors.darkText)
                .text(this._truncate(product.name, 40), 85, boxY + 2)
                .fillColor(this.colors.secondary)
                .font('Helvetica-Bold')
                .text(`R$ ${product.totalRevenue.toFixed(2)}`, 370, boxY + 2)
                .fillColor(this.colors.darkText)
                .font('Helvetica')
                .fontSize(8)
                .text(`(${product.paidCount} confirmados)`, 450, boxY + 2);

            this.doc.moveDown(1.2);
        });

        this.doc.moveDown(1.5);
        this.currentY = this.doc.y;
        return this;
    }

    addStudentSummary(studentStats) {
        if (studentStats.length === 0) return this;

        const top5 = studentStats.slice(0, 5);
        
        this.doc
            .fontSize(11)
            .font('Helvetica-Bold')
            .fillColor(this.colors.primary)
            .text('TOP 5 ALUNOS COM MAIS DOACOES', 50, this.doc.y, { align: 'left' })
            .moveDown(0.8);

        top5.forEach((student, index) => {
            const boxY = this.doc.y;
            
            this.doc
                .circle(65, boxY + 7, 10)
                .fill(this.colors.accent);

            this.doc
                .fontSize(8)
                .font('Helvetica-Bold')
                .fillColor('#FFFFFF')
                .text(`${index + 1}`, 62, boxY + 3);

            this.doc
                .fontSize(9)
                .font('Helvetica')
                .fillColor(this.colors.darkText)
                .text(this._truncate(student.name, 35), 85, boxY + 2)
                .fillColor(this.colors.secondary)
                .font('Helvetica-Bold')
                .text(`R$ ${student.totalPaid.toFixed(2)}`, 370, boxY + 2)
                .fillColor(this.colors.darkText)
                .font('Helvetica')
                .fontSize(8)
                .text(`(${student.paymentCount} pagamentos)`, 450, boxY + 2);

            this.doc.moveDown(1.2);
        });

        this.doc.moveDown(1);
        this.currentY = this.doc.y;
        return this;
    }

    addFooter() {
        const pages = this.doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            this.doc.switchToPage(i);
            
            // Linha no rodapé
            this.doc
                .strokeColor(this.colors.accent)
                .lineWidth(2)
                .moveTo(50, 770)
                .lineTo(545, 770)
                .stroke();

            this.doc
                .fontSize(8)
                .font('Helvetica')
                .fillColor(this.colors.darkText)
                .text(
                    `Pagina ${i + 1} de ${pages.count}`,
                    50,
                    775,
                    { align: 'center' }
                );
        }
        return this;
    }

    _truncate(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    _formatType(type) {
        const types = {
            'DONATION': 'Doacao',
            'PRODUCT': 'Produto',
            'SERVICE': 'Servico'
        };
        return types[type] || type;
    }

    getBuffer() {
        return new Promise((resolve, reject) => {
            const buffers = [];
            this.doc.on('data', buffers.push.bind(buffers));
            this.doc.on('end', () => resolve(Buffer.concat(buffers)));
            this.doc.on('error', reject);
            this.doc.end();
        });
    }

    getStream() {
        return this.doc;
    }
}

module.exports = PdfReportGenerator;
