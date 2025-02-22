const { PrismaClient } = require('@prisma/client');
const e = require('express');
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    const {product_id, name, description, price, category, image_url} = req.body;
    try {
        const product = await prisma.products.create({
            data: {
                product_id,
                name,
                description,
                price,
                category,
                image_url
            }
        });
        res.status(200).json({
            status: "ok",
            message: `Product with id ${product.product_id} created successfully`
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while creating the Product",
            error: error.message
        });
    }
};

const getProducts = async (req, res) => {
    const product = await prisma.products.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง products
    res.json(product);
};

const getProduct = async (req, res) => {
    const id = req.params.id;
    try{
        const product = await prisma.products.findUnique({
            where: {
                product_id: Number(id)
            }
        });
        if (!product){
            res.status(404).json({message: "Product not found"});
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        res.status(500).json({err});
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        //ตรวจสอบว่ามี product นี้อยู่หรือไม่
        const existingProduct = await prisma.products.findUnique({
            where: {
                product_id: Number(id)
            }
        });
        //ถ้าไม่มี product นี้อยู่
        if(!existingProduct){
            res.status(404).json({message: "Product not found"});
        } else {
        //ถ้ามี product นี้อยู่
            await prisma.products.delete({
                where: {
                    product_id: Number(id)
                }
            });
            res.status(200).json({
                status: "success",
                message: `Product with id ${id} deleted successfully`});
        }

    } catch (error) {
        res.status(500).json({error});
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;
    // ตรวขสอบว่ามีข้อมูลที่จะอัพเดทหรือไม่
    const data = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (price) data.price = price;
    if (category) data.category = category;
    if (image_url) data.image_url = image_url;

    // ตรวจสอบว่ามี data ที่จะอัพเดทหรือไม่
    if (Object.keys(data).length === 0) {
        res.status(400).json({
            status: "error",
            message: "No data to update"});
        return;
    }
    try {
        //ตรวจสอบว่ามี customer นี้อยู่หรือไม่
        const product = await prisma.products.update({
            data: data,
            where: {
                product_id: Number(id)
            }
        });
        res.status(200).json({
                status: "success",
                message: `Product with id ${id} updated successfully`,
                product: product
            });

    } catch (error) {
        if (error.code === "P2002") {
            res.status(404).json({
                status: "error",
                message: "Name already exists"
            });
        } else if (error.code === "P2025") {
            res.status(404).json({
                status: "error",
                message: `Product with id ${id} not found`
            });
        } else {
            console.error('Update customer error:', error);
            res.status(500).json({
                status: "error",
                message: "Error updating the product",
            });
        }
    }
};

module.exports = {
    createProduct, getProducts, getProduct, deleteProduct, updateProduct
};