import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/application/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const result = await service.validateUser('admin', 'admin123');

      expect(result).toEqual({
        id: '1',
        username: 'admin',
      });
    });

    it('should return null when credentials are invalid', async () => {
      const result = await service.validateUser('admin', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return null when user not found', async () => {
      const result = await service.validateUser('nonexistent', 'password');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const mockToken = 'mock.jwt.token';
      jwtService.sign.mockReturnValue(mockToken);

      const user = { id: '1', username: 'admin' };
      const result = await service.login(user);

      expect(result).toEqual({
        access_token: mockToken,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'admin',
        sub: '1',
      });
    });
  });

  describe('generateHashedPassword', () => {
    it('should generate a hashed password', async () => {
      const password = 'testpassword';
      const result = await service.generateHashedPassword(password);

      expect(result).toBeDefined();
      expect(result).not.toBe(password);
      expect(typeof result).toBe('string');
    });
  });
});
