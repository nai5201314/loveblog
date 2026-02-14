export const errorHandler = (err, req, res, next) => {
  console.error('错误:', err);
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      success: false,
      message: '数据已存在，不能重复添加'
    });
  }
  if (err.code === 'ECONNREFUSED') {
    return res.status(500).json({
      success: false,
      message: '数据库连接失败'
    });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
};
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `路由 ${req.originalUrl} 不存在,未知的访问，联系qq11814064`
  });
};
