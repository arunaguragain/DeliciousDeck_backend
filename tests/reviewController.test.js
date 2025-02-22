const request = require('supertest');
const app = require('../index.js');
const Review = require('../model/Review');
const jwt = require('jsonwebtoken');

// Mocking the necessary modules
jest.mock('../model/Review');
jest.mock('jsonwebtoken');

jest.mock('../middleware/authorization.js', () => jest.fn((roles = []) => (req, res, next) => {
    req.user = { userId: 1 };  // Ensure the userId is set properly here
    next();
}));

describe('Review Controller', () => {
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

  // Test Case 1: Should create a new review
  it('should create a new review', async () => {
    // Mocking Review.create method to simulate successful review creation
    Review.create.mockResolvedValue({
      userId: 1,
      reviewText: 'Great service!',
      rating: 5,
      serviceId: 2
    });

    // Sending a POST request to create a new review
    const res = await request(app)
      .post('/reviews/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        reviewText: 'Great service!',
        rating: 5,
        serviceId: 2
      });

    // Asserting that the review creation was successful and the correct status code is returned
    expect(res.status).toBe(201);
    expect(res.body.reviewText).toBe('Great service!');
  });

  // Test Case 2: Should return error if review creation fails
  it('should return error if review creation fails', async () => {
    // Mocking Review.create to simulate a failure
    Review.create.mockRejectedValue(new Error('Error creating review'));

    const res = await request(app)
      .post('/reviews/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ reviewText: 'Error Review' });

    // Asserting that the error response is returned with the correct status
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Error creating review');
  });

  // Test Case 3: Should get all reviews for a user
  it('should get all reviews for a user', async () => {
    // Mocking Review.findAll to return a list of reviews for the mocked userId (1)
    Review.findAll.mockResolvedValue([
      { reviewText: 'Great service!', rating: 5, userId: 1 }
    ]);

    const res = await request(app)
      .get('/reviews/')
      .set('Authorization', `Bearer ${authToken}`);

    // Asserting that the response contains reviews and the correct status is returned
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test Case 4: Should get a specific review by ID
  it('should get a specific review by ID', async () => {
    // Mocking Review.findByPk to return a review by ID
    Review.findByPk.mockResolvedValue({ reviewText: 'Great service!', rating: 5 });

    const res = await request(app)
      .get('/reviews/1')
      .set('Authorization', `Bearer ${authToken}`);

    // Asserting that the review is retrieved and the correct status is returned
    expect(res.status).toBe(200);
    expect(res.body.reviewText).toBe('Great service!');
  });

  // Test Case 5: Should update a review
  it('should update a review', async () => {
    // Mocking Review.findByPk to return an existing review and enabling the save method
    Review.findByPk.mockResolvedValue({
      reviewText: 'Great service!',
      rating: 5,
      save: jest.fn().mockImplementation(function() {
        this.reviewText = 'Updated review'; // Update reviewText when save is called
        return this;  // Return the updated object
      })
    });

    const res = await request(app)
      .put('/reviews/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ reviewText: 'Updated review', rating: 4 });

    // Asserting that the review update was successful
    expect(res.status).toBe(200);
    expect(res.body.reviewText).toBe('Updated review');
  });

  // Test Case 6: Should delete a review
  it('should delete a review', async () => {
    // Mocking Review.findByPk to return an existing review and enabling the destroy method
    Review.findByPk.mockResolvedValue({
      reviewText: 'Great service!',
      rating: 5,
      destroy: jest.fn()
    });

    const res = await request(app)
      .delete('/reviews/1')
      .set('Authorization', `Bearer ${authToken}`);

    // Asserting that the review was deleted successfully and the correct status is returned
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Review deleted successfully');
  });
});
