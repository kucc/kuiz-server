import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as jwt from 'jsonwebtoken';

import { UserEntity } from "../entity/user.entity";
import SSOUserDTO from "./dto/sso-user.dto";
import { UserResponseDTO } from '../user/dto/user-response.dto'

@Injectable()
export class AuthService{

  constructor(
    @InjectRepository(UserEntity)
    public readonly UserRepository: Repository<UserEntity>
  ){}

  public decryptCodeFromSSOServer(code: string): SSOUserDTO {
    const { data } = jwt.verify(code, process.env.SSO_JWT_SECRET) as { data: SSOUserDTO };

    return data;
  }

  public createAccessToken(user: UserEntity): string{
    const userResponseDTO = new UserResponseDTO(user);

    return jwt.sign(
      {data: userResponseDTO, timestamp: Date.now()},
      process.env.JWT_SECRET,
      {
        expiresIn: Number(process.env.JWT_EXPIRATION)
      }
    );
  }

  
}