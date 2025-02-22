const request = require('supertest');
const app = require('../index.js');
const Reservation = require('../model/Reservation');
const jwt = require('jsonwebtoken');

// Mocking the necessary modules
jest.mock('../model/Reservation');
jest.mock('jsonwebtoken');

jest.mock('../middleware/authorization.js', () => jest.fn((roles = []) => (req, res, next) => {
    req.user = { userId: 1 };  // Ensure the userId is set properly here
    next();
  }));
  

describe('Reservation Controller', () => {
  let authToken;

  // Helper function to mock authentication token
  const mockAuthToken = () => {
    return jwt.sign({ userId: 1, role: 'user' }, 'your_jwt_secret_key', { expiresIn: '1h' });
  };

  beforeAll(() => {
    // Mock JWT verify method to simulate authentication with a role
    jwt.verify = jest.fn().mockReturnValue({ userId: 1, role: 'user' });
    authToken = mockAuthToken(); // Generate a valid auth token with userId 1
  });

  afterAll(() => {
    const server = app.listen(3000); // Start the server here to capture the instance for closing
    server.close();  // Close the server after tests are done
  });

  // Test Case 1: Should create a new reservation
  it('should create a new reservation', async () => {
    // Mocking Reservation.create method to simulate successful reservation creation
    Reservation.create.mockResolvedValue({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      reservationDate: '2025-02-22',
      reservationTime: '18:00:00',
      guestCount: 4,
      tableNo: 5,
      UseruserId: 1 // Using UseruserId to match the model
    });

    // Sending a POST request to create a new reservation
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

    // Asserting that the reservation creation was successful and the correct status code is returned
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('John Doe');
  });

  // Test Case 2: Should return error if reservation creation fails
  it('should return error if reservation creation fails', async () => {
    // Mocking Reservation.create to simulate a failure
    Reservation.create.mockRejectedValue(new Error('Error creating reservation'));

    const res = await request(app)
      .post('/reservations/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Error User' });

    // Asserting that the error response is returned with the correct status
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Error creating reservation');
  });

  // Test Case: Should get all reservations for a user
it('should get all reservations for a user', async () => {
    // Mocking Reservation.findAll to return a list of reservations for the mocked userId (1)
    Reservation.findAll.mockResolvedValue([
      { name: 'John Doe', reservationDate: '2025-02-22', UseruserId: 1 }
    ]);
  
    const res = await request(app)
      .get('/reservations/')
      .set('Authorization', `Bearer ${authToken}`);  // Make sure to set the mock token
  
    // Asserting that the response contains reservations and the correct status is returned
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
  

  // Test Case 4: Should get a specific reservation by ID
  it('should get a specific reservation by ID', async () => {
    // Mocking Reservation.findByPk to return a reservation by ID
    Reservation.findByPk.mockResolvedValue({ name: 'John Doe', reservationDate: '2025-02-22' });

    const res = await request(app)
      .get('/reservations/1')
      .set('Authorization', `Bearer ${authToken}`);

    // Asserting that the reservation is retrieved and the correct status is returned
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('John Doe');
  });

  // Test Case 5: Should update a reservation
  it('should update a reservation', async () => {
    // Mocking Reservation.findByPk to return an existing reservation and enabling the save method
    Reservation.findByPk.mockResolvedValue({
      name: 'John Doe',
      email: 'johndoe@example.com',
      save: jest.fn()
    });

    const res = await request(app)
      .put('/reservations/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Name' });

    // Asserting that the reservation update was successful
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  // Test Case 6: Should delete a reservation
  it('should delete a reservation', async () => {
    // Mocking Reservation.findByPk to return an existing reservation and enabling the destroy method
    Reservation.findByPk.mockResolvedValue({
      name: 'John Doe',
      reservationDate: '2025-02-22',
      destroy: jest.fn()
    });

    const res = await request(app)
      .delete('/reservations/1')
      .set('Authorization', `Bearer ${authToken}`);

    // Asserting that the reservation was deleted successfully and the correct status is returned
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Reservation deleted successfully');
  });
});
