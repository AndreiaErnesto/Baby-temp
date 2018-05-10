module. exports = {
  database: 'mongodb://localhost:27017/nodebt',
  secret: 'yoursecret',
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
