import { Test, TestingModule } from '@nestjs/testing';
import { PrivateFilesController } from './private-files.controller';

describe('PrivateFilesController', () => {
  let controller: PrivateFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivateFilesController],
    }).compile();

    controller = module.get<PrivateFilesController>(PrivateFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
