const db = require("../index");
const products = db.products;

class ProductRepository {
    constructor() { }

    async findOneProduct(query) {
        try {
            const productsFound = await products.findOne(query);
            return productsFound;
        } catch (error) {
            console.log('Database error: ', error);
        }
    }
    async createProduct(data) {
        try {
            const productsCreated = await products.create(data);
            return productsCreated;
        } catch (error) {
            console.log('Database error: ', error);
        }
    }
    async findAllProduct(query) {
        try {
            const productsList = await products.findAll(query);
            return productsList;
        } catch (error) {
            console.log('Database error: ', error);
        }
    }
    async updateProduct(data, query) {
        try {
            const updatedProducts = await products.update(data, query);
            return updatedProducts;
        } catch (error) {
            console.log('Database error: ', error);
        }
    }
    async deleteProduct(Products) {
        try {
            await products.destroy();
        } catch (error) {
            console.log('Database error: ', error);
        }
    }
}

module.exports = ProductRepository;