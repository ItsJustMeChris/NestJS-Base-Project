import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/models/users.entity';
import { Repository } from 'typeorm';
import { Authenticator } from '../models/authenticators.entity';
import * as bcrypt from 'bcrypt';
import { decrypt, encrypt, Hash } from '../../../helpers/functions/crypt';
import { UsersService } from 'src/modules/users/services/users.service';
import { authenticator as OTPAuthenticator } from 'otplib';

@Injectable()
export class AuthenticatorsService {
  constructor(
    @InjectRepository(Authenticator)
    private authenticatorRepository: Repository<Authenticator>,
    private usersService: UsersService,
  ) {}

  async findByUserType(
    user: Partial<User>,
    authenticator: Partial<Authenticator>,
  ) {
    return this.authenticatorRepository.findOne({
      where: {
        user: user.id,
        type: authenticator.type,
      },
    });
  }

  async create(
    authenticator: Partial<Authenticator>,
    password: string,
  ): Promise<Authenticator> {
    const user: User = await this.usersService.findByID(authenticator.user.id);
    const isValid: boolean = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    authenticator.recovery = await bcrypt.hash(authenticator.recovery, 10);
    const crypted: Hash = encrypt(authenticator.secret, password);

    authenticator.iv = crypted.iv;
    authenticator.secret = crypted.content;
    return authenticator.save();
  }

  async authenticate(user: Partial<User>, token: string, type: string) {
    const authenticator: Authenticator = await this.findByUserType(user, {
      type,
    });

    if (!authenticator) {
      return false;
    }

    const hash: Hash = new Hash({
      iv: authenticator.iv,
      content: authenticator.secret,
    });

    const decrypted: string = decrypt(hash, user.password);

    const isValid: boolean = OTPAuthenticator.check(token, decrypted);

    return isValid;
  }
}
