import { UserLoginMiddleware } from './user-login.middleware';

describe('UserLoginMiddleware', () => {
  it('should be defined', () => {
    expect(new UserLoginMiddleware()).toBeDefined();
  });
});
