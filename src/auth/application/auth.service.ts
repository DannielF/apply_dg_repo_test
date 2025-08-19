import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface LoginResult {
  access_token: string;
}

@Injectable()
export class AuthService {
  // For simplicity, using hardcoded user. In real app, use database
  private readonly users = [
    {
      id: '1',
      username: 'admin',
      password: '$2b$10$nx2fG.HhUWVWnCFTyaeD2OIQC.Uo/z2NEcFSLvDD9ZEXk/8R230WS', // 'admin123'
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<LoginResult> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateHashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
