import { Body, Controller } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Post } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }
}
