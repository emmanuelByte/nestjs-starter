import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PublicFile from './publicFile.entity';
import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile) private repo: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid}-${filename}`,
      })
      .promise();

    const newFile = this.repo.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.repo.save(newFile);
    return newFile;
  }

  async deletePublicFile(fileId: number) {
    const file = await this.repo.findOne({
      where: {
        id: fileId,
      },
    });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await this.repo.delete(fileId);
  }
}
