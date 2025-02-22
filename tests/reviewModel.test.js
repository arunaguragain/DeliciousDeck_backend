const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();
const ReviewMock = dbMock.define('Review', {
  reviewID: 1,
  UseruserId: 1,
  ratings: 5,
  comment: 'Great experience!'
});

describe('Review Model', () => {
  it('should create a review', async () => {
    const review = await ReviewMock.create({
      UseruserId: 1,
      ratings: 4,
      comment: 'Very good!'
    });

    expect(review.UseruserId).toBe(1);
    expect(review.ratings).toBe(4);
    expect(review.comment).toBe('Very good!');
  });

  it('should require a rating and comment', async () => {
    try {
      await ReviewMock.create({ UseruserId: 1 });
    } catch (error) {
      expect(error.message).toContain("ratings cannot be null");
      expect(error.message).toContain("comment cannot be null");
    }
  });

  it('should validate the correct data type for ratings', async () => {
    try {
      await ReviewMock.create({
        UseruserId: 1,
        ratings: 'not a number', // Invalid type for ratings
        comment: 'Invalid rating'
      });
    } catch (error) {
      expect(error.message).toContain("ratings must be an integer");
    }
  });

  it('should allow null values for comment', async () => {
    const review = await ReviewMock.create({
      UseruserId: 1,
      ratings: 3,
      comment: null // Allow null for comment
    });

    expect(review.comment).toBeNull();
  });
});
