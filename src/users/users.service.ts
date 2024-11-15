import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserSignInDto } from './dto/user-signin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>

  ) {}

  async signup(userSignUpDto:UserSignUpDto):Promise<UserEntity>{

    const userExists=await this.findUserByEmail(userSignUpDto.email);

    if(userExists) throw new BadRequestException('Email ya registrado');

    userSignUpDto.password= await hash(userSignUpDto.password,10);

    let user=this.usersRepository.create(userSignUpDto);

    user = await this.usersRepository.save(user);

    delete user.password;

    return user;
  }

  async signin(userSignInDto:UserSignInDto):Promise<UserEntity>{

    const userExists=await this.usersRepository.createQueryBuilder('users').addSelect('users.password').where('users.email=:email',{email:userSignInDto.email}).getOne();

    if(!userExists) throw new BadRequestException('Email no registrado');

    const isMatch = await compare(userSignInDto.password, userExists.password);

    if(!isMatch) throw new BadRequestException('Contraseña incorrecta');

    delete userExists.password;

    return userExists;
  } 
  
 async create(createUserDto: CreateUserDto) {

    const userExists=await this.findUserByEmail(createUserDto.email);

    if(userExists) throw new BadRequestException('Email ya registrado');

    createUserDto.password= await hash(createUserDto.password,10);

    let user = this.usersRepository.create(createUserDto);

    user = await this.usersRepository.save(user);

    delete user.password;

    return user;
  }

  async findAll():Promise<UserEntity[]> {

    return await this.usersRepository.find();
  }

  async findOne(id: number):Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {id:id},
      relations: {
        orders: true,
        plannings:true,
        budgets:true,
        products:true,
      },
      select:{
        orders: {
          id: true,
        },
        plannings:{
          id:true,
          status:true,
        },
        budgets:{
          id:true,
        },
        products:{
          id:true,
        }
      }    
  });
    if (!user) throw new BadRequestException(`User #${id} not found`);  
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
    }

    async findUserByEmail(email:string){
      return await this.usersRepository.findOneBy({email:email});

    }

    async accessToken(user:UserEntity):Promise<string>{
      return sign({id:user.id,mail:user.email,roles:user.roles},process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn:process.env.ACCESS_TOKEN_EXPIRE_TIME});
    }


}
