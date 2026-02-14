import pool from '../config/database.js';
export const getPlans = async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = 'SELECT id, title, `desc`, create_date, deadline, finish_date, status, author, created_at, updated_at FROM plan';
    let params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY create_date DESC, created_at DESC';

    const [plans] = await pool.execute(query, params);

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    next(error);
  }
};
export const getPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [plans] = await pool.execute(
      'SELECT * FROM plan WHERE id = ?',
      [id]
    );

    if (plans.length === 0) {
      return res.status(404).json({
        success: false,
        message: '计划不存在'
      });
    }

    res.json({
      success: true,
      data: plans[0]
    });
  } catch (error) {
    next(error);
  }
};
export const createPlan = async (req, res, next) => {
  try {
    const { title, desc, create_date, deadline } = req.body;

    if (!title || !create_date) {
      return res.status(400).json({
        success: false,
        message: '标题和创建日期不能为空'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO plan (title, `desc`, create_date, deadline, status, author) VALUES (?, ?, ?, ?, ?, ?)',
      [title, desc || null, create_date, deadline || null, 'unfinished', req.body.author || 'male']
    );

    res.status(201).json({
      success: true,
      message: '计划创建成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};
export const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, desc, create_date, deadline, status, finish_date } = req.body;

    const [result] = await pool.execute(
      'UPDATE plan SET title = ?, `desc` = ?, create_date = ?, deadline = ?, status = ?, finish_date = ? WHERE id = ?',
      [title, desc || null, create_date, deadline || null, status || 'unfinished', finish_date || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '计划不存在'
      });
    }

    res.json({
      success: true,
      message: '计划更新成功'
    });
  } catch (error) {
    next(error);
  }
};
export const deletePlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM plan WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '计划不存在'
      });
    }

    res.json({
      success: true,
      message: '计划删除成功'
    });
  } catch (error) {
    next(error);
  }
};
