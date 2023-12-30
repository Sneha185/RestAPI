const mongoose = require('mongoose');
const Product = require('../models/product');


//No Authentication needed
//address --> localhost:4200/products
exports.products_get_all = async (req, res, next) => {
    try {
        const products = await Product.find();
        const productCount = products.length;

        const transformedProducts = products.map(product => {
            const productUrl = `${req.protocol}://${req.get('host')}/products/${product._id}`;
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${product.productImage}`;

            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                url: productUrl,
                imageUrl: imageUrl
            };
        });

        res.status(200).json({
            count: productCount,
            products: transformedProducts
        });
    } catch (err) {
        res.status(500).json({ message: 'Error getting products' });
        next(err);
    }
}

//Authentication needed, product name, product price, product image are required
//address  --> localhost:4200/products
exports.products_create_product = async (req, res, next) => {
    try {
        console.log(req.file);
        const { name, price } = req.body;

        // Validate the request body
        if (!name || !price) {
            return res.status(400).json({ error: 'Name and price are required fields' });
        }

        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name,
            price,
            productImage: req.file.path // Set the file path
        });

        await product.save();
        console.log(product);
        const productUrl = `${req.protocol}://${req.get('host')}/products/${product._id}`;

        res.status(201).json({
            message: 'Product created successfully',
            createdProduct: {
                name: product.name,
                price: product.price,
                _id: product._id,
                url: productUrl,
                productImage: req.file.path // Include the file path in the response
            }
        });
    } catch (error) {
        console.error('Error creating product', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
}

//No Authentication
//productId needed
//address --> localhost:4200/products/productId
exports.products_get_product = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findOne({ _id: productId });
        const productUrl = `${req.protocol}://${req.get('host')}/products`;
        if (product) {
            res.status(201).json({
                Product: {
                    name: product.name,
                    price: product.price,
                    _id: product._id,
                    "All Products": productUrl
                }
            });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to get product. Please try again.' });
        next(err);
    }
}

//Authentication, productId needed
//address --> localhost:4200/products/productId
exports.products_update_product = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updatedData }, { new: true });

        const response = {
            message: 'Product updated successfully',
            updatedData: updatedData,
            updatedProduct: updatedProduct
        };

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product. Please try again.' });
        next(err);
    }
}

//Authentication, productId needed
//address --> localhost:4200/products/productId
exports.products_delete_product = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findOne({ _id: productId });

        const productUrl = `${req.protocol}://${req.get('host')}/products`;
        if (!product) {
            return res.status(404).json({
                message: 'Product not found', "All Products": productUrl,
                "body": {
                    "name": "String",
                    "price": "Number"
                }
            });
        }

        await Product.deleteOne({ _id: productId });

        res.status(200).json({
            message: 'Product deleted successfully',
            "All Products": productUrl,
            "body": {
                "name": "String",
                "price": "Number"
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product. Please try again.' });
        next(err);
    }
}