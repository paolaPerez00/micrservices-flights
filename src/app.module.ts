import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightModule } from './flight/flight.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ ConfigModule.forRoot({
    envFilePath: ['.env-development'],
    isGlobal: true
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const uri = configService.get<string>('URI_MONGODB');
      if (!uri) {
        throw new Error('La variable de entorno URI_MONGODB no está definida');
      }
      return { uri };
    },
    inject: [ConfigService],
  }),
  FlightModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
