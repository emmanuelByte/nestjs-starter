import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { PrivateFile } from './privateFile.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PrivateFilesService {
  constructor(
    @InjectRepository(PrivateFile) private repo: Repository<PrivateFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPrivateFile(
    dataBuffer: Buffer,
    ownerId: number,
    filename: string,
  ) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Key: `${uuid}-${filename}`,
        Body: dataBuffer,
      })
      .promise();

    const newFile = this.repo.create({
      key: uploadResult.Key,
      owner: {
        id: ownerId,
      },
    });
    await this.repo.save(newFile);
    return newFile;
  }

  async getPrivateFile(fileId: number) {
    const s3 = new S3();
    const fileInfo = await this.repo.findOne({
      where: {
        id: fileId,
      },
      relations: {
        owner: true,
      },
    });
    if (!fileInfo) {
      throw new NotFoundException();
    }
    const stream = await s3
      .getObject({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Key: fileInfo.key,
      })
      .createReadStream();

    return {
      stream,
      info: fileInfo,
    };
  }

  async deletePrivateFile(fileId: number) {
    const file = await this.repo.findOne({
      where: {
        id: fileId,
      },
    });
    const s3 = new S3();
    await s3
      .deleteObject({
        Key: file.key,
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      })
      .promise();
    await this.repo.delete(fileId);
  }

  async generatePresignedUrl(key: string) {
    const s3 = new S3();
    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
    });
  }
}
