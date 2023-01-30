import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CoffeesModule,
    UsersModule,
    DatabaseModule,
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
