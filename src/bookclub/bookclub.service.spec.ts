import { Test, TestingModule } from '@nestjs/testing';
import { BookclubService } from './bookclub.service';

describe('BookclubService', () => {
  let service: BookclubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookclubService],
    }).compile();

    service = module.get<BookclubService>(BookclubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
