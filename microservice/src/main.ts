import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:3001',
        package: 'user',
        protoPath: join(__dirname, './user/user.proto'),
      },
    },
  );

  await app.listen();
  console.log('User microservice is listening...');
}
bootstrap();
