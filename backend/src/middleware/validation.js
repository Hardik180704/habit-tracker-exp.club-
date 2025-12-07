export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || username.length < 3 || username.length > 50) {
    return res.status(400).json({ error: 'Username must be 3-50 characters' });
  }
  
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  
  next();
};

export const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  next();
};
