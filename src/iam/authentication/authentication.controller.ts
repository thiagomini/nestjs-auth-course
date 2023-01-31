import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ActiveUser } from './decorators/active-user.decorator';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthType } from './enums/auth-type.enum';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { OtpAuthenticationService } from './otp-authentication.service';
import type { Response } from 'express';
import { toFileStream } from 'qrcode';

@Controller('authentication')
@Auth(AuthType.None)
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  @Post('sign-up')
  public signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK) // changed since the default is 201
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() response: Response,
  ) {
    const { secret, uri } = await this.otpAuthService.generateSecret(
      activeUser.email,
    );
    await this.otpAuthService.enableTfaForUser(activeUser.email, secret);
    response.type('png');
    return toFileStream(response, uri);
  }
}
