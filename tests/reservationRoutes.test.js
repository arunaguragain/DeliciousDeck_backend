const request = require('supertest');
const app = require('../index.js');
const jwt = require('jsonwebtoken'); 
const Reservation = require('../model/Reservation'); 

// Mock JWT verify method to simulate authentication
jest.mock('jsonwebtoken');
jest.mock('../model/Reservation');

// Mock Authorization Middleware
jest.mock('../middleware/authorization.js', () => jest.fn(() => (req, res, next) => {
  req.user = { userId: 1 };  
  next();
}));

describe('Reservation Routes', () => {
  let authToken;

  // Generate a mock authentication token
  const mockAuthToken = () => {
    return jwt.sign({ userId: 1 }, 'your_jwt_secret_key');  
  };

  beforeAll(() => {
    authToken = mockAuthToken();
  });

  afterAll(() => {
    if (app.server) {
      app.server.close(); // Close the server to prevent EADDRINUSE error
    }
  });

  it('should create a reservation via POST /reservations/create', async () => {
    // Mock Reservation.create to return a successful response
    Reservation.create.mockResolvedValue({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      reservationDate: '2025-02-22',
      reservationTime: '18:00:00',
      guestCount: 4,
      tableNo: 5,
      userId: 1  // Ensure userId is included
    });

    const res = await request(app)
      .post('/reservations/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '1234567890',
        reservationDate: '2025-02-22',
        reservationTime: '18:00:00',
        guestCount: 4,
        tableNo: 5
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('John Doe');
  });

  it('should get all reservations via GET /reservations', async () => {
    // Mock Reservation.findAll to return a list of reservations
    Reservation.findAll.mockResolvedValue([
      { name: 'John Doe', reservationDate: '2025-02-22', userId: 1 }
    ]);

    const res = await request(app)
      .get('/reservations/')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a specific reservation via GET /reservations/:id', async () => {
    // Mock Reservation.findByPk to return a reservation by ID
    Reservation.findByPk.mockResolvedValue({ name: 'John Doe', reservationDate: '2025-02-22' });

    const res = await request(app)
      .get('/reservations/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('John Doe');
  });

  it('should update a reservation via PUT /reservations/:id', async () => {
    // Mock Reservation.findByPk to return an existing reservation
    Reservation.findByPk.mockResolvedValue({
      name: 'John Doe',
      email: 'johndoe@example.com',
      save: jest.fn()  // Mock the save function
    });

    const res = await request(app)
      .put('/reservations/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('should delete a reservation via DELETE /reservations/:id', async () => {
    // Mock Reservation.findByPk to return an existing reservation
    Reservation.findByPk.mockResolvedValue({
      name: 'John Doe',
      reservationDate: '2025-02-22',
      destroy: jest.fn()  // Mock the destroy function
    });

    const res = await request(app)
      .delete('/reservations/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Reservation deleted successfully');
  });
});
