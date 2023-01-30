import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CoffeesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
