const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();
const MenuItemMock = dbMock.define('MenuItem', {
  itemID: 1,
  name: 'Pizza',
  description: 'Delicious cheese pizza',
  price: 10,
  category: 'Food',
  UseruserId: 1
});

describe('MenuItem Model', () => {
  it('should create a menu item', async () => {
    const menuItem = await MenuItemMock.create({
      name: 'Burger',
      description: 'Tasty beef burger',
      price: 12,
      category: 'Food',
      UseruserId: 2
    });

    expect(menuItem.name).toBe('Burger');
    expect(menuItem.description).toBe('Tasty beef burger');
    expect(menuItem.price).toBe(12);
    expect(menuItem.category).toBe('Food');
    expect(menuItem.UseruserId).toBe(2);
  });

  it('should require a name and price', async () => {
    try {
      await MenuItemMock.create({
        description: 'Test description',
        category: 'Test category',
        UseruserId: 1
      });
    } catch (error) {
      expect(error.message).toContain("name cannot be null");
      expect(error.message).toContain("price cannot be null");
    }
  });

  it('should validate the correct data type for price', async () => {
    try {
      await MenuItemMock.create({
        name: 'Sushi',
        description: 'Delicious sushi',
        price: 'not a number', // Invalid type for price
        category: 'Food',
        UseruserId: 1
      });
    } catch (error) {
      expect(error.message).toContain("price must be an integer");
    }
  });

  it('should allow null values for description', async () => {
    const menuItem = await MenuItemMock.create({
      name: 'Pasta',
      description: null, // Allow null for description
      price: 8,
      category: 'Food',
      UseruserId: 2
    });

    expect(menuItem.description).toBeNull();
  });

  it('should validate the correct data type for UseruserId', async () => {
    try {
      await MenuItemMock.create({
        name: 'Salad',
        description: 'Fresh green salad',
        price: 7,
        category: 'Food',
        UseruserId: 'not a number' // Invalid type for UseruserId
      });
    } catch (error) {
      expect(error.message).toContain("UseruserId must be an integer");
    }
  });
});
