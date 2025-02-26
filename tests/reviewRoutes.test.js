const request = require('supertest');
const app = require('../index.js');
const jwt = require('jsonwebtoken');
const Review = require('../model/Review');

// Mocking the necessary modules
jest.mock('jsonwebtoken');
jest.mock('../model/Review');

describe('Review Routes', () => {
  let authToken;
  let server;  // Declare server variable to use in afterAll for proper shutdown

  // Helper function to mock authentication token
  const mockAuthToken = () => {
    return jwt.sign({ userId: 1, role: 'user' }, 'your_jwt_secret_key', { expiresIn: '1h' });
  };

  beforeAll(() => {
    // Mock JWT verify method to simulate authentication with a role
    jwt.verify = jest.fn().mockReturnValue({ userId: 1, role: 'user' });
    authToken = mockAuthToken(); // Generate a valid auth token with userId 1

    server = app.listen(3001, () => { 
    });
  });

  afterAll(() => {
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

    const res = await request(app)
      .post('/reviews/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        reviewText: 'Great service!',
        rating: 5,
        serviceId: 2
      });

    expect(res.status).toBe(201);
    expect(res.body.reviewText).toBe('Great service!');
  });

  // Test Case 2: Should return error if review creation fails
  it('should return error if review creation fails', async () => {
    // Simulate server error on review creation
    Review.create.mockRejectedValue(new Error('Error creating review'));

    const res = await request(app)
      .post('/reviews/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ reviewText: 'Error Review' });

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

    expect(res.status).toBe(200);
    expect(res.body.reviewText).toBe('Great service!');
  });

  // Test Case 5: Should update a review
  it('should update a review', async () => {
    // Mocking Review.findByPk to return an existing review
    const mockReview = {
      reviewText: 'Great service!',
      rating: 5,
      save: jest.fn().mockImplementation(function() {
        this.reviewText = 'Updated review'; // Update the review text
        this.rating = 4; // Update the rating
        return Promise.resolve(this); // Return the updated review object
      })
    };
  
    // Mocking Review.findByPk to return the review
    Review.findByPk.mockResolvedValue(mockReview);
  
    const res = await request(app)
      .put('/reviews/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ reviewText: 'Updated review', rating: 4 });
  
    // Ensure save method was called and the updated review is returned
    expect(mockReview.save).toHaveBeenCalled(); 
    expect(res.status).toBe(200);
    expect(res.body.reviewText).toBe('Updated review'); // Expect the updated text
    expect(res.body.rating).toBe(4); // Ensure the rating is updated as well
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

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Review deleted successfully');
  });
});
