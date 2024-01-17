import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const swaggerConfig = (app: INestApplication<any>) => {
  const options = new DocumentBuilder().setTitle("JustLook API").setDescription("JustLook REST Api documentation.").setVersion("1.0").addTag("JustLook").addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup("api-docs", app, document, {});
};
