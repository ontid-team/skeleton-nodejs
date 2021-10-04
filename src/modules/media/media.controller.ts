import AutoBind from 'auto-bind';
import { Request, Response } from 'express';

import { ControllerCore } from '@core/index';
import { HttpStatus } from '@utils/index';

import { MediaDTO } from './dto';
import { IMediaService } from './interface';

export default class MediaController extends ControllerCore {
  constructor(private readonly service: IMediaService) {
    super();

    AutoBind(this);
  }

  async upload(req: Request, res: Response) {
    const {
      filename: path,
      originalname: name,
      mimetype: mimeType,
      size,
    } = req.file as Express.Multer.File;

    const data = await this.service.create({
      path,
      thumbnailPath: path,
      mimeType,
      name,
      size,
    });

    this.response(res, { data, dto: MediaDTO, status: HttpStatus.Created });
  }
}
