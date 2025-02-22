const request = require('supertest');
const app = require('../index.js');
const MenuItem = require('../model/MenuItem');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../model/MenuItem');
jest.mock('jsonwebtoken');

// Mock authentication middleware
jest.mock('../middleware/authorization.js', () =>
  jest.fn((roles = []) => (req, res, next) => {
    req.user = { userId: 1 }; // Simulated authenticated user
    next();
  })
);

describe('MenuItem Controller', () => {
  let authToken;

  // Generate mock auth token
  const mockAuthToken = () => {
    return jwt.sign({ userId: 1, role: 'user' }, 'your_jwt_secret_key', {
      expiresIn: '1h',
    });
  };

  beforeAll(() => {
    jwt.verify = jest.fn().mockReturnValue({ userId: 1, role: 'user' });
    authToken = mockAuthToken();
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Give time for cleanup
  });

  // Test 1: Create a new menu item
  it('should create a new menu item', async () => {
    const newMenuItem = {
      name: 'Pasta',
      description: 'Delicious pasta',
      price: 15,
      category: 'Food',
      UseruserId: 1,
    };

    MenuItem.create.mockResolvedValue({
      ...newMenuItem,
      toJSON: () => newMenuItem,
    });

    const res = await request(app)
      .post('/menu/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newMenuItem);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Pasta');
    expect(res.body.price).toBe(15);
  });

  // Test 2: Handle menu item creation failure
  it('should return error if menu item creation fails', async () => {
    MenuItem.create.mockRejectedValue(new Error('Error creating menu item'));

    const res = await request(app)
      .post('/menu/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Error Item' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Error creating menu item');
  });

  // Test 3: Fetch all menu items
  it('should return all menu items', async () => {
    const menuItems = [
      {
        itemID: 1,
        name: 'Pizza',
        description: 'Cheese pizza',
        price: 10,
        category: 'Food',
        UseruserId: 1,
      },
      {
        itemID: 2,
        name: 'Burger',
        description: 'Beef burger',
        price: 12,
        category: 'Food',
        UseruserId: 2,
      },
    ];

    MenuItem.findAll.mockResolvedValue(menuItems.map(item => ({ toJSON: () => item })));

    const res = await request(app)
      .get('/menu/')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe('Pizza');
  });

  // Test 4: Fetch a specific menu item
  it('should return a specific menu item', async () => {
    const menuItem = {
      itemID: 1,
      name: 'Pizza',
      description: 'Cheese pizza',
      price: 10,
      category: 'Food',
      UseruserId: 1,
    };

    MenuItem.findByPk.mockResolvedValue({
      ...menuItem,
      toJSON: () => menuItem,
    });

    const res = await request(app)
      .get('/menu/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Pizza');
  });

  // Test 5: Handle menu item not found
  it('should return 404 if menu item not found', async () => {
    MenuItem.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .get('/menu/999')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Menu item not found');
  });

  // Test 6: Delete a menu item
  it('should delete a menu item', async () => {
    const menuItem = {
      itemID: 1,
      name: 'Pizza',
      description: 'Cheese pizza',
      price: 10,
      category: 'Food',
      UseruserId: 1,
      destroy: jest.fn(),
    };

    MenuItem.findByPk.mockResolvedValue({
      ...menuItem,
      toJSON: () => menuItem,
    });

    const res = await request(app)
      .delete('/menu/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Menu item deleted successfully');
  });

  // Test 7: Handle menu item not found for deletion
  it('should return 404 if menu item not found for deletion', async () => {
    MenuItem.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .delete('/menu/999')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Menu item not found');
  });
});
