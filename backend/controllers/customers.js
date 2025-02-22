const { PrismaClient } = require('@prisma/client');
const e = require('express');
const prisma = new PrismaClient();

// insert a new customer
const createCustomer = async (req, res) => {
    const {customer_id, first_name, last_name, address, email, phone_number} = req.body;
    try {
        const cust = await prisma.customers.create({
            data: {
                customer_id,
                first_name,
                last_name,
                address,
                email,
                phone_number
            }
        });
        res.status(200).json({
            status: "ok",
            message: `User with id ${cust.customer_id} created successfully`
        });
            

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while creating the user",
            error: error.message
        });
    }
};

//get all customers

const getCustomers = async (req, res) => {
    const custs = await prisma.customers.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง customers
    res.json(custs);
};

const getCustomer = async (req, res) => {
    const id = req.params.id;
    try{
        const cust = await prisma.customers.findUnique({
            where: {
                customer_id: Number(id)
            }
        });
        if (!cust){
            res.status(404).json({message: "Customer not found"});
        } else {
            res.status(200).json(cust);
        }
    } catch (error) {
        res.status(500).json({err});
    }
}

const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        //ตรวจสอบว่ามี customer นี้อยู่หรือไม่
        const existingCustomer = await prisma.customers.findUnique({
            where: {
                customer_id: Number(id)
            }
        });
        //ถ้าไม่มี customer นี้อยู่
        if(!existingCustomer){
            res.status(404).json({message: "Customer not found"});
        } else {
        //ถ้ามี customer นี้อยู่
            await prisma.customers.delete({
                where: {
                    customer_id: Number(id)
                }
            });
            res.status(200).json({
                status: "success",
                message: `Customer with id ${id} deleted successfully`});
        }

    } catch (error) {
        res.status(500).json({error});
    }
}

const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, address, email, phone_number } = req.body;
    // ตรวขสอบว่ามีข้อมูลที่จะอัพเดทหรือไม่
    const data = {};
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;
    if (address) data.address = address;
    if (email) data.email = email;
    if (phone_number) data.phone_number = phone_number;

    // ตรวจสอบว่ามี data ที่จะอัพเดทหรือไม่
    if (Object.keys(data).length === 0) {
        res.status(400).json({
            status: "error",
            message: "No data to update"});
        return;
    }
    try {
        //ตรวจสอบว่ามี customer นี้อยู่หรือไม่
        const cust = await prisma.customers.update({
            data: data,
            where: {
                customer_id: Number(id)
            }
        });
        res.status(200).json({
                status: "success",
                message: `Customer with id ${id} updated successfully`,
                user: cust
            });

    } catch (error) {
        if (error.code === "P2002") {
            res.status(404).json({
                status: "error",
                message: "Email already exists"
            });
        } else if (error.code === "P2025") {
            res.status(404).json({
                status: "error",
                message: `User with id ${id} not found`
            });
        } else {
            console.error('Update customer error:', error);
            res.status(500).json({
                status: "error",
                message: "Error updating the customer",
            });
        }
    }
};


module.exports = {
    createCustomer, getCustomers, getCustomer, deleteCustomer, updateCustomer
};