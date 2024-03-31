import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async registerUser(createUserDto: CreateUserDto) {
    const existingEmail = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    const existingUser = await this.userService.findOneByUsername(
      createUserDto.username,
    );

    if (existingEmail) {
      throw new ConflictException('Email already taken');
    }
    if (existingUser) {
      throw new ConflictException('Username already taken');
    }

    const response = await axios.post('http://localhost:5000/assign-role', {})
    const role = response.data.role;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 8);
    const res = await this.userService.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      role,
    });
    delete res.password;
    return {
      user: res,
    };
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
