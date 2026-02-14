import pool from '../config/database.js';
export const getPhotos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8;
    const offset = (page - 1) * pageSize;

    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM photo'
    );
    const total = countResult[0].total;
    const [photos] = await pool.execute(
      `SELECT id, title, cover, \`desc\`, date, author, 
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at 
       FROM photo ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    res.json({
      success: true,
      data: {
        list: photos,
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
export const getPhotoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [photos] = await pool.execute(
      `SELECT id, title, cover, \`desc\`, date, author,
       DATE_FORMAT(created_at, '%Y-%m-%d' ) as created_at,
       DATE_FORMAT(updated_at, '%Y-%m-%d ') as updated_at
       FROM photo WHERE id = ?`,
      [id]
    );

    if (photos.length === 0) {
      return res.status(404).json({
        success: false,
        message: '照片不存在'
      });
    }

    res.json({
      success: true,
      data: photos[0]
    });
  } catch (error) {
    next(error);
  }
};
export const createPhoto = async (req, res, next) => {
  try {
    const { title, cover, desc, date } = req.body;

    if (!title || !cover || !date) {
      return res.status(400).json({
        success: false,
        message: '标题、封面和日期不能为空'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO photo (title, cover, `desc`, date, author) VALUES (?, ?, ?, ?, ?)',
      [title, cover, desc || null, date, req.body.author || 'male']
    );

    res.status(201).json({
      success: true,
      message: '照片创建成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};
export const updatePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, cover, desc, date } = req.body;

    const [result] = await pool.execute(
      'UPDATE photo SET title = ?, cover = ?, `desc` = ?, date = ?, author = ? WHERE id = ?',
      [title, cover, desc || null, date, req.body.author || 'male', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '照片不存在'
      });
    }

    res.json({
      success: true,
      message: '照片更新成功'
    });
  } catch (error) {
    next(error);
  }
};
export const deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM photo WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '照片不存在'
      });
    }

    res.json({
      success: true,
      message: '照片删除成功'
    });
  } catch (error) {
    next(error);
  }
};
