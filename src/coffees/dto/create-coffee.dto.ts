import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  name: string;
}
