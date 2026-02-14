import pool from '../config/database.js';
export const getTimes = async (req, res, next) => {
  try {
    const { tag } = req.query;

    let query = 'SELECT * FROM `time`';
    let params = [];

    if (tag && tag !== 'all') {
      query += ' WHERE tag = ?';
      params.push(tag);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const [times] = await pool.execute(query, params);

    res.json({
      success: true,
      data: times
    });
  } catch (error) {
    next(error);
  }
};
export const getTimeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [times] = await pool.execute(
      'SELECT * FROM `time` WHERE id = ?',
      [id]
    );

    if (times.length === 0) {
      return res.status(404).json({
        success: false,
        message: '时光记录不存在'
      });
    }

    res.json({
      success: true,
      data: times[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createTime = async (req, res, next) => {
  try {
    const { title, date, tag, desc, location, emotion } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: '标题和日期不能为空'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO `time` (title, date, tag, `desc`, location, emotion) VALUES (?, ?, ?, ?, ?, ?)',
      [title, date, tag || null, desc || null, location || null, emotion || null]
    );

    res.status(201).json({
      success: true,
      message: '时光记录创建成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, date, tag, desc, location, emotion } = req.body;

    const [result] = await pool.execute(
      'UPDATE `time` SET title = ?, date = ?, tag = ?, `desc` = ?, location = ?, emotion = ? WHERE id = ?',
      [title, date, tag || null, desc || null, location || null, emotion || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '时光记录不存在'
      });
    }

    res.json({
      success: true,
      message: '时光记录更新成功'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTime = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM `time` WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '时光记录不存在'
      });
    }

    res.json({
      success: true,
      message: '时光记录删除成功'
    });
  } catch (error) {
    next(error);
  }
};
