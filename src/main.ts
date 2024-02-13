import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
// import { ValidationPipe } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import * as session from "express-session";
// import * as passport from "passport";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const config = new DocumentBuilder()
  //   .setTitle("Extra-ed")
  //   .setDescription("Extra-ed API")
  //   .setVersion("1.0")
  //   .addTag("Extra-ed")
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup("api", app, document);
  // app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  // app.setGlobalPrefix("api");

  // app.use(
  //   session({
  //     secret: "secret",
  //     saveUninitialized: false,
  //     resave: false,
  //     cookie: { maxAge: 60000 },
  //   }),
  // );

  // app.use(passport.initialize());

  // app.use(passport.session());
  // const configureSrvice = app.get(ConfigService);
  // const port = configureSrvice.get<number>("PORT");

  await app.listen(3000);
}
bootstrap();
