const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllRoles = async (req, res) => {
    try {
      // Retrieve all roles
      const allRoles = await prisma.role.findMany();
  
      return res.status(200).json(allRoles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  const createRole = async (req, res) => {
    try {
      const { roleName } = req.body;
  
      // Check if the role name already exists
      const existingRole = await prisma.role.findUnique({ where: { name: roleName } });
      if (existingRole) {
        return res.status(400).json({ error: 'Role name already exists' });
      }
  
      // Create a new role
      const newRole = await prisma.role.create({
        data: {
          name: roleName,
        },
      });
  
      return res.status(201).json(newRole);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
module.exports = { getAllRoles, createRole };