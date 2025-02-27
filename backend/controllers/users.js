const { PrismaClient } = require('@prisma/client');
const e = require('express');
const prisma = new PrismaClient();



const createUsers = async (req, res) => {
    const {UserName, UserID, Password, Status, Role} = req.body;
    try {
        const user = await prisma.users.create({
            data: {
                UserName,
                UserID,
                Password,
                Status,
                Role
            }
        });
        res.status(200).json({
            status: "ok",
            message: `User with id ${user.UserID} created successfully`
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while creating the Product",
            error: error.message
        });
    }
};

const getUsers = async (req, res) => {
    const user = await prisma.users.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง user
    res.json(user);
};

const getUser = async (req, res) => {
    const id = req.params.id;
    try{
        const user = await prisma.users.findUnique({
            where: {
                UserID: Number(id)
            }
        });
        if (!user){
            res.status(404).json({message: "User not found"});
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({err});
    }
}

const deleteUsers = async (req, res) => {
    const { id } = req.params;
    try {
        //ตรวจสอบว่ามี users นี้อยู่หรือไม่
        const existingUsers = await prisma.users.findUnique({
            where: {
                UserID: Number(id)
            }
        });
        //ถ้าไม่มี users นี้อยู่
        if(!existingUsers){
            res.status(404).json({message: "User not found"});
        } else {
        //ถ้ามี product นี้อยู่
            await prisma.users.delete({
                where: {
                    UserID: Number(id)
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

const updateUsers = async (req, res) => {
    const { id } = req.params;
    const { UserName, Password, Status, Role } = req.body;
    // ตรวขสอบว่ามีข้อมูลที่จะอัพเดทหรือไม่
    const data = {};
    if (UserName) data.UserName = UserName;
    if (Password) data.Password = Password;
    if (Status) data.Status = Status;
    if (Role) data.Role = Role;

    // ตรวจสอบว่ามี data ที่จะอัพเดทหรือไม่
    if (Object.keys(data).length === 0) {
        res.status(400).json({
            status: "error",
            message: "No data to update"});
        return;
    }
    try {
        //ตรวจสอบว่ามี customer นี้อยู่หรือไม่
        const user = await prisma.users.update({
            data: data,
            where: {
                UserID: Number(id)
            }
        });
        res.status(200).json({
                status: "success",
                message: `User with id ${id} updated successfully`,
                User: user
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
                message: `User with id ${id} not found`
            });
        } else {
            console.error('Update customer error:', error);
            res.status(500).json({
                status: "error",
                message: "Error updating the User",
            });
        }
    }
};


module.exports = {
    createUsers, getUsers, getUser, deleteUsers, updateUsers
};