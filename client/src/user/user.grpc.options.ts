import 'dotenv/config';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const microserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: `${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}`,
    package: 'user',
    protoPath: join(__dirname, './user.proto'),
  },
};
