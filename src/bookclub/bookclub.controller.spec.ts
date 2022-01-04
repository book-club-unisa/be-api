import { Test, TestingModule } from '@nestjs/testing';
import { BookclubController } from './bookclub.controller';

describe('BookclubController', () => {
  let controller: BookclubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookclubController],
    }).compile();

    controller = module.get<BookclubController>(BookclubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
