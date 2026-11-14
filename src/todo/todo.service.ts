import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepo: Repository<Todo>,
  ) {}

  create(userId: number, dto: CreateTodoDto) {
    return this.todoRepo.save({ ...dto, userId });
  }

  findMine(userId: number) {
    return this.todoRepo.find({ where: { userId } });
  }

  async update(id: number, userId: number, dto: UpdateTodoDto) {
    const todo = await this.todoRepo.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException('해당하는 리스트가 없습니다.');
    }
    if (todo.userId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }
    Object.assign(todo, dto);
    return this.todoRepo.save(todo);
  }

  async toggleDone(id: number, userId: number) {
    const todo = await this.todoRepo.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException('해당 투두리스트가 없습니다.');
    }
    if (todo.userId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }
    todo.done = !todo.done;
    return this.todoRepo.save(todo);
  }

  async delete(id: number, userId: number) {
    const todo = await this.todoRepo.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException('해당하는 리스트가 없습니다.');
    }
    if (todo.userId !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다');
    }
    return this.todoRepo.delete(id);
  }
}
