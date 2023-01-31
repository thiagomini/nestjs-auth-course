import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeysService } from '../users/api-keys/api-keys.service';
import { ApiKey } from '../users/api-keys/entities/api-key.entity';
import { User } from '../users/entities/user.entity';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { ApiKeyGuard } from './authentication/guards/api-key.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { PoliciesGuard } from './authorization/guards/policies.guard';
import { RolesGuard } from './authorization/guards/roles.guard';
import { FrameworkContributorPolicyHandler } from './authorization/policies/framework-contributor.policy';
import { PolicyHandlerStorage } from './authorization/policies/policy-handlers.storage';
import jwtConfig from './config/jwt.config';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { GoogleAuthenticationService } from './authentication/social/google-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/google-authentication.controller';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthenticationService,
    AccessTokenGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: PoliciesGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    RefreshTokenIdsStorage,
    FrameworkContributorPolicyHandler,
    PolicyHandlerStorage,
    ApiKeyGuard,
    ApiKeysService,
    GoogleAuthenticationService,
    OtpAuthenticationService,
  ],
  controllers: [AuthenticationController, GoogleAuthenticationController],
})
export class IamModule {}
