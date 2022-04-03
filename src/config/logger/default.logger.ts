import { LoggerService } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import * as moment from 'moment';

const { errors, combine, json, timestamp, ms, prettyPrint } = winston.format;

export class DefaultLogger implements LoggerService {
  private logger: winston.Logger;

  constructor(service, logPath?: string) {
    this.logger = winston.createLogger({
      format: combine(
        errors({ stack: true }),
        json(),
        timestamp({ format: 'isoDateTime' }),
        ms(),
        prettyPrint(),
      ),
      defaultMeta: { service },
      transports: [
        new winston.transports.File({
          level: 'error',
          filename: `error-${moment(new Date()).format('YYYY-MM-DD')}.log`,
          dirname: `logs/${logPath ? logPath : 'default'}`,
          maxsize: 5000000,
        }),
        new winston.transports.Console({
          level: 'debug',
          format: combine(nestWinstonModuleUtilities.format.nestLike()),
        }),
        new winston.transports.File({
          filename: `application-${moment(new Date()).format(
            'YYYY-MM-DD',
          )}.log`,
          dirname: `logs/${logPath ? logPath : 'default'}`,
          maxsize: 5000000,
        }),
      ],
    });

    if (process.env.APP_ENV !== 'prod') {
      console.log = (message: any, params?: any) => {
        this.logger.debug(message, params);
      };
    }
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
