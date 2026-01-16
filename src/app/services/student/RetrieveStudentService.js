const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const errorFactory = require('../../../domain/error/ErrorFactory');

module.exports = ({ studentRepository, exception }) => ({
    execute: async (query) => {
        console.log('getStudent - query: ', query);

        try {

            let filter = {};

            if (query) {

                let queryBuilder = [];

                if (query.name) {
                    queryBuilder.push({
                        name: {
                            [Op.iLike]: `%${query.name}%`
                        }
                    });
                }
                if (query.ramo) {
                    queryBuilder.push({
                        ramo: query.ramo
                    });
                }

                filter = {
                    where: {
                        [Op.and]: queryBuilder
                    }
                };

            }

            const studentsRetrieved = await studentRepository.findAllStudent(filter);

            if (studentsRetrieved) {
                return studentsRetrieved;
            } else {
                throw exception.notFound(errorFactory([
                    `Student not found with this name or ramo ${query}`,
                    `Student not found with this name or ramo ${query}`
                ]));
            }
        }
        catch (error) {
            console.log('getStudent - queryType:', query, ' - [Error]: ', error);
            throw error;
        }
    }
});
