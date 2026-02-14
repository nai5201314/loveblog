import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }
    const [admins] = await pool.execute(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    const admin = admins[0];
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    const token = generateToken({ 
      id: admin.id, 
      username: admin.username 
    });

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        username: admin.username,
        id: admin.id
      }
    });
  } catch (error) {
    next(error);
  }
};
export const getAdminInfo = async (req, res, next) => {
  try {
    const adminId = req.user.id;

    const [admins] = await pool.execute(
      'SELECT id, username, created_at FROM admin WHERE id = ?',
      [adminId]
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: '管理员不存在'
      });
    }

    res.json({
      success: true,
      data: admins[0]
    });
  } catch (error) {
    next(error);
  }
};
