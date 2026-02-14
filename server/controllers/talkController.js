import pool from '../config/database.js';

export const getTalks = async (req, res, next) => {
  try {
    const [talks] = await pool.execute(
      'SELECT * FROM talk ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: talks
    });
  } catch (error) {
    next(error);
  }
};
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         '0.0.0.0';
};

const getCityByIp = async (ip) => {
  try {
    return '';
  } catch (error) {
    return '';
  }
};
export const createTalk = async (req, res, next) => {
  try {
    const { qq, nickname, avatar, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: '留言内容不能为空'
      });
    }

    if (!qq || !qq.trim()) {
      return res.status(400).json({
        success: false,
        message: 'QQ号码不能为空'
      });
    }

    if (!nickname || !nickname.trim()) {
      return res.status(400).json({
        success: false,
        message: '昵称不能为空'
      });
    }
    const clientIp = getClientIp(req);
    const city = await getCityByIp(clientIp);
    const finalAvatar = avatar || `https://q1.qlogo.cn/g?b=qq&nk=${qq.trim()}&s=640`;

    const [result] = await pool.execute(
      'INSERT INTO talk (qq, nickname, avatar, content, ip, city) VALUES (?, ?, ?, ?, ?, ?)',
      [qq.trim(), nickname.trim(), finalAvatar, content.trim(), clientIp, city]
    );
    const [newTalks] = await pool.execute(
      'SELECT * FROM talk WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: '留言创建成功',
      data: newTalks[0]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTalk = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM talk WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '留言不存在'
      });
    }

    res.json({
      success: true,
      message: '留言删除成功'
    });
  } catch (error) {
    next(error);
  }
};
