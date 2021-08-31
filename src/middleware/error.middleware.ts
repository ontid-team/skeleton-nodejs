import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';

import { MiddlewareCore, HttpException, Logger } from '@core/index';
import { CodeResponse } from '@utils/index';

class ErrorMiddleware extends MiddlewareCore {
  handler(): ErrorRequestHandler {
    return (
      error: HttpException,
      _req: Request,
      res: Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _next: NextFunction,
    ) => {
      let response = CodeResponse.SERVER_ERROR;

      if (error.status === 404) {
        response = CodeResponse.NOT_FOUND;
      } else if (error.message === 'ROUTE_NOT_FOUND') {
        response = CodeResponse.ROUTE_NOT_FOUND;
      } else if (error.code === 'LIMIT_FILE_SIZE') {
        response = CodeResponse.LIMIT_FILE_SIZE;
      } else if (error.code && error.status && error.message) {
        response = { ...error };
      }

      const errorRes = new HttpException(response);

      Logger.error(errorRes.message, error);

      res.status(errorRes.status).json(errorRes);
    };
  }
}

export default new ErrorMiddleware();
