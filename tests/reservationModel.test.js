const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();
const ReservationMock = dbMock.define('Reservation', {
  reservationId: 1,
  name: 'John Doe',
  email: 'johndoe@example.com',
  phone: '1234567890',
  reservationDate: '2025-02-22',
  reservationTime: '18:00:00',
  guestCount: 4,
  tableNo: 5,
  UseruserId: 1
});

describe('Reservation Model', () => {
  it('should create a reservation', async () => {
    const reservation = await ReservationMock.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phone: '9876543210',
      reservationDate: '2025-02-22',
      reservationTime: '19:00:00',
      guestCount: 2,
      tableNo: 3,
      UseruserId: 1
    });

    expect(reservation.name).toBe('Jane Doe');
    expect(reservation.email).toBe('janedoe@example.com');
    expect(reservation.phone).toBe('9876543210');
    expect(reservation.reservationDate).toBe('2025-02-22');
    expect(reservation.reservationTime).toBe('19:00:00');
    expect(reservation.guestCount).toBe(2);
    expect(reservation.tableNo).toBe(3);
  });

  it('should require an email and reservationDate', async () => {
    try {
      await ReservationMock.create({ name: 'No Date' });
    } catch (error) {
      expect(error.message).toContain("email cannot be null");
      expect(error.message).toContain("reservationDate cannot be null");
    }
  });
});
