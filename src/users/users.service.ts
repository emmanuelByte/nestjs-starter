import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { PrivateFilesService } from 'src/private-files/private-files.service';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUserDto';
import User from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private readonly filesService: FilesService,
    private readonly privateFilesService: PrivateFilesService,
  ) {}

  async getById(id: number) {
    const user = await this.repo.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.repo.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async create(userData: UpdateUserDto) {
    const newUser = await this.repo.create(userData);
    await this.repo.save(newUser);
    return newUser;
  }

  getAllAddressesWithUsers() {
    return this.repo.find({ relations: ['user'] });
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const user = await this.getById(userId);
    if (user.avatar) {
      await this.repo.update(userId, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(user.avatar.id);
    }
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.repo.update(userId, {
      ...user,
      avatar,
    });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.repo.update(userId, {
        ...user,
        avatar: null,
      });
    }
    await this.filesService.deletePublicFile(fileId);
  }

  async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
    return this.privateFilesService.uploadPrivateFile(
      imageBuffer,
      userId,
      filename,
    );
  }

  async deletePrivateFile(userId: number, fileId: number) {
    // const user = await this.getById(userId);
    const file = await this.privateFilesService.getPrivateFile(fileId);
    if (file.info.owner.id !== userId) {
      throw new UnauthorizedException();
    }
    await this.privateFilesService.deletePrivateFile(fileId);
  }

  async getPrivateFile(userId: number, fileId: number) {
    const file = await this.privateFilesService.getPrivateFile(fileId);
    if (file.info.owner.id !== userId) {
      throw new UnauthorizedException();
    }
    return file;
  }

  async getAllPrivateFiles(userId: number) {
    const userWithFiles = await this.repo.findOne({
      where: {
        id: userId,
      },
      relations: {
        files: true,
      },
    });
    if (!userWithFiles) {
      throw new NotFoundException('User with this id does not exist');
    }
    return Promise.all(
      userWithFiles.files.map(async (file) => {
        const url = await this.privateFilesService.generatePresignedUrl(
          file.key,
        );
        return {
          ...file,
          url,
        };
      }),
    );
  }
}
