import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import PublicFile from './publicFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile]), ConfigModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
