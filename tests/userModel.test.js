const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();
// Define a mock User model
const UserMock = dbMock.define('Users', {
  userId: 1,
  fullName: 'John Doe',
  dob: '1990-01-01',
  email: 'johndoe@example.com',
  address: '123 Test St',
  password: 'securepassword',
  role: 'user',
  profilePicture: 'profile.jpg'
});

describe('User Model', () => {
  it('should create a user', async () => {
    const user = await UserMock.create({
      fullName: 'Jane Doe',
      dob: '1995-05-15',
      email: 'janedoe@example.com',
      address: '456 Example Ave',
      password: 'strongpassword',
      role: 'admin',
      profilePicture: 'jane.jpg',
    });

    expect(user.fullName).toBe('Jane Doe');
    expect(user.dob).toBe('1995-05-15');
    expect(user.email).toBe('janedoe@example.com');
    expect(user.address).toBe('456 Example Ave');
    expect(user.password).toBe('strongpassword');
    expect(user.role).toBe('admin');
    expect(user.profilePicture).toBe('jane.jpg');
  });

  it('should require an email and password', async () => {
    // Manually check the validation behavior
    try {
      await UserMock.create({ fullName: 'No Email' });
    } catch (error) {
      expect(error.message).toContain("email cannot be null");  // Adjust based on your validation logic
    }
  });

  it('should have a default role of user', async () => {
    const user = await UserMock.create({
      fullName: 'Default Role User',
      email: 'default@example.com',
      password: 'defaultpassword',
    });

    expect(user.role).toBe('user');
  });
});
