import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import JwtAuthGuard from 'src/auth/jwtAuth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor)
  async addAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addAvatar(
      req.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Post('files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addPrivateFile(
      req.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Get('files/:id')
  @UseGuards(JwtAuthGuard)
  async getPrivateFile(
    @Req() req: RequestWithUser,
    @Param() id: string,
    @Res() res: Response,
  ) {
    const file = await this.usersService.getPrivateFile(
      req.user.id,
      Number(id),
    );
    file.stream.pipe(res);
  }

  @Get('files')
  @UseGuards(JwtAuthGuard)
  async getAllPrivateFiles(@Req() req: RequestWithUser) {
    return this.usersService.getAllPrivateFiles(req.user.id);
  }
}
