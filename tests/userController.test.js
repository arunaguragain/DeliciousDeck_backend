const userController = require('../controllers/userController');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock Sequelize Methods
jest.mock('../model/User', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
}));

// Mock bcrypt and jwt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('User Controller', () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should register a new user', async () => {
    const req = {
      body: {
        fullName: 'John Doe',
        dob: '1990-01-01',
        email: 'john@example.com',
        address: '123 Street',
        password: 'password123',
      },
    };
    const res = mockResponse();

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.create.mockResolvedValue({ id: 1, ...req.body, password: 'hashedPassword', role: 'user' });

    await userController.registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ email: req.body.email }));
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should return an error if user already exists', async () => {
    const req = { body: { email: 'existing@example.com' } };
    const res = mockResponse();

    User.findOne.mockResolvedValue({ id: 1, email: req.body.email });

    await userController.registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('should log in a user with valid credentials', async () => {
    const req = { body: { email: 'john@example.com', password: 'password123' } };
    const res = mockResponse();

    User.findOne.mockResolvedValue({ userId: 1, email: req.body.email, password: 'hashedPassword', role: 'user' });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mockToken');

    await userController.loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, 'hashedPassword');
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'mockToken' }));
  });

  it('should return an error for invalid credentials', async () => {
    const req = { body: { email: 'john@example.com', password: 'wrongpassword' } };
    const res = mockResponse();

    User.findOne.mockResolvedValue({ userId: 1, email: req.body.email, password: 'hashedPassword', role: 'user' });
    bcrypt.compare.mockResolvedValue(false);

    await userController.loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should get user profile', async () => {
    const req = { headers: { authorization: 'Bearer mockToken' } };
    const res = mockResponse();
    
    jwt.verify.mockReturnValue({ userId: 1 });
    User.findOne.mockResolvedValue({ userId: 1, fullName: 'John Doe', email: 'john@example.com' });

    await userController.getProfile(req, res);

    expect(jwt.verify).toHaveBeenCalledWith('mockToken', 'your_jwt_secret_key');
    expect(User.findOne).toHaveBeenCalledWith({ where: { userId: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return an error for invalid token', async () => {
    const req = { headers: { authorization: 'Bearer invalidToken' } };
    const res = mockResponse();

    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    await userController.getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Error retrieving profile' }));
  });
});
