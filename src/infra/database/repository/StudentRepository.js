const db = require("../index");
const student = db.students;

class StudentRepository {
    constructor() { }
    
    async findOneStudent(query) {
        try {
            const studentFound = await student.findOne(query);
            return studentFound;
        } catch (error) {
            console.log('Database error: ', error);
        }
    }
    async createStudent(data) {
        try {
            const studentCreated = await student.create(data);
            return studentCreated;
        } catch (error) {
            console.log('Database error: ', error);
        }
    }
    async findAllStudent(query) {
        try {
            const studentList = await student.findAll(query);
            return studentList;
        } catch (error) {
            console.log('Database error: ', error);
        }
    }
    async updateStudent(data, query) {
        try {
            const updatedStudent = await student.update(data, query);
            return updatedStudent;
        } catch (error) {
            console.log('Database error: ', error);
        }
    }
    async deleteStudent(student) {
        try {
            await student.destroy();
        } catch (error) {
            console.log('Database error: ', error);
        }
    }
}

module.exports = StudentRepository;