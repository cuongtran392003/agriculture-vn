import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/tasks/tasks.module';
import { PlotModule } from './modules/plot/plot.module';
import { FarmModule } from './modules/farm/farm.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MarketModule } from './modules/market/market.module';
import { CropCareModule } from './modules/crop-care/crop-care.module';
import { CropsModule } from './modules/crops/crops.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI') ??
          (process.env.NODE_ENV === 'production'
            ? undefined
            : 'mongodb://127.0.0.1:27017/agricultureVN');

        if (!uri) {
          throw new Error('MONGODB_URI is required in production. Set it in the environment or .env file.');
        }

        return { uri };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    TaskModule,
    PlotModule,
    FarmModule,
    ScheduleModule.forRoot(),
    MarketModule,
    CropCareModule,
    CropsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
