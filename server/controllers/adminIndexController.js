import pool from '../config/database.js';
export const getDashboardStats = async (req, res, next) => {
  try {
    const [diaryStats] = await pool.execute(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN DATE(date) = CURDATE() THEN 1 ELSE 0 END) AS today,
        SUM(CASE WHEN DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS week,
        SUM(CASE WHEN DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS month
      FROM diary
    `);
    const [photoStats] = await pool.execute(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN DATE(date) = CURDATE() THEN 1 ELSE 0 END) AS today,
        SUM(CASE WHEN DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS week,
        SUM(CASE WHEN DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS month
      FROM photo
    `);
    const [timeStats] = await pool.execute(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN DATE(date) = CURDATE() THEN 1 ELSE 0 END) AS today,
        SUM(CASE WHEN DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS week,
        SUM(CASE WHEN DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS month
      FROM time
    `);
   const [planStats] = await pool.execute(`
  SELECT 
    COUNT(*) AS total,
    SUM(CASE WHEN status = 'finished' THEN 1 ELSE 0 END) AS finished,
    SUM(CASE WHEN status = 'unfinished' THEN 1 ELSE 0 END) AS unfinished,
    ROUND(
      SUM(CASE WHEN status = 'finished' THEN 1 ELSE 0 END) / COUNT(*) * 100, 
      2
    ) AS completionRate
  FROM plan
`);
    const [dynamicStats] = await pool.execute(`
      SELECT COUNT(*) AS total FROM dynamic
    `);
    const [musicStats] = await pool.execute(`
      SELECT COUNT(*) AS total FROM music
    `);
    const stats = {
      diary: diaryStats[0],
      photo: photoStats[0],
      time: timeStats[0],
      plan: planStats[0],
      dynamic: dynamicStats[0],
      music: musicStats[0]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};