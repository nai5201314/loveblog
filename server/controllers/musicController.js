import pool from '../config/database.js';
export const getMusics = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8;
    const offset = (page - 1) * pageSize;

    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM music'
    );
    const total = countResult[0].total;

    const [musics] = await pool.execute(
      'SELECT id, title, singer, cover, duration, date, author FROM music ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?',
      [pageSize, offset]
    );

    res.json({
      success: true,
      data: {
        list: musics,
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
export const getMusicById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [musics] = await pool.execute(
      'SELECT * FROM music WHERE id = ?',
      [id]
    );

    if (musics.length === 0) {
      return res.status(404).json({
        success: false,
        message: '音乐不存在'
      });
    }

    res.json({
      success: true,
      data: musics[0]
    });
  } catch (error) {
    next(error);
  }
};
export const createMusic = async (req, res, next) => {
  try {
    const { title, singer, cover, url, duration, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: '标题和日期不能为空'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO music (title, singer, cover, url, duration, date) VALUES (?, ?, ?, ?, ?, ?)',
      [title, singer || null, cover || null, url || null, duration || null, date]
    );

    res.status(201).json({
      success: true,
      message: '音乐创建成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};
export const updateMusic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, singer, cover, url, duration, date } = req.body;

    const [result] = await pool.execute(
      'UPDATE music SET title = ?, singer = ?, cover = ?, url = ?, duration = ?, date = ?, author = ? WHERE id = ?',
      [title, singer || null, cover || null, url || null, duration || null, date, req.body.author || 'male', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '音乐不存在'
      });
    }

    res.json({
      success: true,
      message: '音乐更新成功'
    });
  } catch (error) {
    next(error);
  }
};
export const deleteMusic = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM music WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '音乐不存在'
      });
    }

    res.json({
      success: true,
      message: '音乐删除成功'
    });
  } catch (error) {
    next(error);
  }
};
