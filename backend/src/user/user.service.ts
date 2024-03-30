import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user): Promise<User> {
    const { username, email, password,role} = user;
    const newUser = await this.usersRepository.create({
      email,
      username,
      password,
      role,
    });
    const result = await this.usersRepository.save(newUser);
    return result;
  }
  async findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }
  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ username });
  }
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email });
  }

  async findAllUser(): Promise<User[]> {
    const users = this.usersRepository.find();
    if ((await users).length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async updateUser(userId: number, updatedUser: Partial<User>): Promise<User> {
    const user = await this.findById(userId);
    Object.assign(user, updatedUser);
    return this.usersRepository.save(user);
  }

  async updateEmail(userId: number, email: string): Promise<User> {
    const user = await this.findById(userId);
    user.email = email;
    return this.usersRepository.save(user);
  }

  async updateUsername(userId: number, username: string): Promise<User> {
    const user = await this.findById(userId);
    user.username = username;
    return this.usersRepository.save(user);
  }

  async updatePassword(userId: number, password: string): Promise<User> {
    const user = await this.findById(userId);
    user.password = password;
    return this.usersRepository.save(user);
  }
}
