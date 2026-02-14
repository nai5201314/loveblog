import pool from '../config/database.js';
export const getDiaries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8;
    const offset = (page - 1) * pageSize;
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM diary'
    );
    const total = countResult[0].total;
    const [diaries] = await pool.execute(
      `SELECT id, title, cover, date, author, 
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at 
       FROM diary ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    res.json({
      success: true,
      data: {
        list: diaries,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
export const getDiaryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [diaries] = await pool.execute(
      `SELECT id, title, content, cover, date, author,
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
       DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
       FROM diary WHERE id = ?`,
      [id]
    );

    if (diaries.length === 0) {
      return res.status(404).json({
        success: false,
        message: '日记不存在'
      });
    }

    res.json({
      success: true,
      data: diaries[0]
    });
  } catch (error) {
    next(error);
  }
};
export const createDiary = async (req, res, next) => {
  try {
    const { title, content, cover, date, author } = req.body;
    if (!content || !date) {
      return res.status(400).json({
        success: false,
        message: '内容和日期不能为空'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO diary (title, content, cover, date, author) VALUES (?, ?, ?, ?, ?)',
      [title || '', content, cover || null, date, author || 'male']
    );

    res.status(201).json({
      success: true,
      message: '日记创建成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};
export const updateDiary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, cover, date, author } = req.body;
    const [result] = await pool.execute(
      'UPDATE diary SET title = ?, content = ?, cover = ?, date = ?, author = ? WHERE id = ?',
      [title || '', content, cover || null, date, author || 'male', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '日记不存在'
      });
    }

    res.json({
      success: true,
      message: '日记更新成功'
    });
  } catch (error) {
    next(error);
  }
};
export const deleteDiary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM diary WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '日记不存在'
      });
    }

    res.json({
      success: true,
      message: '日记删除成功'
    });
  } catch (error) {
    next(error);
  }
};