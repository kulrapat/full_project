const { PrismaClient } = require('@prisma/client');
const e = require('express');
const prisma = new PrismaClient();


const createOrders = async (req, res) => {
    const {order_id, customer_id, order_date, order_status, total_amount} = req.body;
    try {
        
        const dateObj = new Date(order_date);
        if (isNaN(dateObj)) {
            return res.status(400).json({
              status: "error",
              message: "Invalid order_date format"
            });
          }

        
        const order = await prisma.orders.create({
            data: {
                order_id,
                customer_id,
                order_date: dateObj,
                order_status,
                total_amount
            }
        });
        res.status(200).json({
            status: "ok",
            message: `Order with id ${order.order_id} created successfully`
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while creating the Order",
            error: error.message
        });
    }
};

const getOrders = async (req, res) => {
    const order = await prisma.orders.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง user
    res.json(order);
};

const getOrder = async (req, res) => {
    const id = req.params.id;
    try{
        const order = await prisma.orders.findUnique({
            where: {
                order_id: Number(id)
            }
        });
        if (!order){
            res.status(404).json({message: "Order not found"});
        } else {
            res.status(200).json(order);
        }
    } catch (error) {
        res.status(500).json({err});
    }
}

const deleteOrders = async (req, res) => {
    const { id } = req.params;
    try {
        //ตรวจสอบว่ามี users นี้อยู่หรือไม่
        const existingOrder = await prisma.orders.findUnique({
            where: {
                order_id: Number(id)
            }
        });
        //ถ้าไม่มี users นี้อยู่
        if(!existingOrder){
            res.status(404).json({message: "Order not found"});
        } else {
        //ถ้ามี product นี้อยู่
            await prisma.orders.delete({
                where: {
                    order_id: Number(id)
                }
            });
            res.status(200).json({
                status: "success",
                message: `Users with id ${id} deleted successfully`});
        }

    } catch (error) {
        res.status(500).json({error});
    }
}

const updateOrders = async (req, res) => {
    const { id } = req.params; // ดึงค่า ID จาก URL
    const { customer_id, order_date, order_status, total_amount } = req.body;

    // ตรวจสอบว่ามีข้อมูลที่ต้องการอัปเดตหรือไม่
    const data = {};
    if (customer_id) data.customer_id = Number(customer_id);
    if (order_date) {
        const parsedDate = new Date(order_date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                status: "error",
                message: "Invalid order_date format. Expected ISO-8601 format."
            });
        }
        data.order_date = parsedDate; // แปลงเป็น Date object ที่ Prisma รองรับ
    }
    if (order_status) data.order_status = order_status;
    if (total_amount) data.total_amount = parseFloat(total_amount);

    // ตรวจสอบว่ามีค่าให้ update จริงหรือไม่
    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            status: "error",
            message: "No data to update"
        });
    }

    try {
        // ตรวจสอบว่ามี Order นี้อยู่หรือไม่ แล้วอัปเดตข้อมูล
        const updatedOrder = await prisma.orders.update({
            data: data,
            where: {
                order_id: Number(id) // ใช้ order_id เป็นตัวระบุ
            }
        });

        res.status(200).json({
            status: "success",
            message: `Order with id ${id} updated successfully`,
            order: updatedOrder
        });

    } catch (error) {
        if (error.code === "P2025") { // Prisma Error: ไม่พบ Order ที่จะอัปเดต
            return res.status(404).json({
                status: "error",
                message: `Order with id ${id} not found`
            });
        } else {
            console.error('Update order error:', error);
            return res.status(500).json({
                status: "error",
                message: "Error updating the Order",
                error: error.message
            });
        }
    }
};



module.exports = {
    createOrders, getOrders, getOrder, deleteOrders, updateOrders
};