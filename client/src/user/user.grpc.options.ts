import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const microserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'microservice:3001',
    package: 'user',
    protoPath: join(__dirname, './user.proto'),
  },
};