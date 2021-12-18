import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { UsersDto } from '../users/dto/users.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import Role from '../users/role.enum'
import { TokenPayload } from './entity/tokenpayload.entity'
import { CreateUsersDto } from '../users/dto/create-users.dto'
import RequestWithUser from './dto/requestWithUser.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registrationData: CreateUsersDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10)
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        role: Role.User,
        password: hashedPassword,
      })
      createdUser.password = undefined
      return createdUser
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }
  public async login(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email)
      await this.verifyPassword(plainTextPassword, user.password)
      user.password = undefined
      return user
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      )
    }
  }
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    )
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      )
    }
  }
  public getJWTToken(email: string, role: Role) {
    const payload: TokenPayload = { email, role }
    return this.jwtService.sign(payload)
  }
  public checkRole(context: ExecutionContext){
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    console.log(request.role)
    return request.role

  }
}
