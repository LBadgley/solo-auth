const bcrypt = require('bcryptjs');
const { hash } = require('../../lib/utils/hash');

describe('encrypt password', () => {
  it('hashes a password', () => {
    return hash('password')
      .then(hashedPassword => {
        expect(hashedPassword).toEqual(expect.any(String));
        expect(hashedPassword).not.toEqual('password');
      });
  });
  it('can compare passwords', () => {
    const password = 'password';
    return hash(password)
      .then(hashedPassword => {
        return bcrypt.compare('password', hashedPassword);
      })
      .then(compareResult => {
        expect(compareResult).toBeTruth();
      });
  });
  it('can compare bad passwords', () => {
    const password = 'password';

    return hash(password)
      .then(hashedPassword => {
        return bcrypt.compare('password1234', hashedPassword);
      })
      .then(compareResult => {
        expect(compareResult).toBeFalsy();
      });
  });
});