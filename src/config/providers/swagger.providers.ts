import { DocumentBuilder } from '@nestjs/swagger';

export class SwaggerProviders {
  public builder = new DocumentBuilder();

  public init() {
    return this.builder
      .setTitle('Nest Js Example')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Token',
        },
        'bearer',
      )
      .build();
  }
}
