import {EazeUserType, OutputUserType, UserDBType} from "../utils/types";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";
export const users = [] as EazeUserType[]

export const usersService:any = {

    async createUser(login:string, email:string, password:string):Promise<EazeUserType | null> {
        const passwordSalt = await bcrypt.genSalt(10);

        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser:UserDBType = {
            _id: new ObjectId(),
            accountData:{
                userName:login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date(),
            },
            emailConfirmation:{
                confirmationCode:uuidv4(),
                expirationDate:add(new Date(), {
                    hours: 3,
                    minutes: 10
                }),
                isConfirmed:false,
            },
        }
        const createdUser = await usersRepository.createUser(newUser);
        return createdUser
    },
   async deleteUser(userID:string): Promise<boolean>{
       return await usersRepository.deleteUser(userID);
    },
    async checkCredentials(loginOrEmail:string, password:string):Promise<OutputUserType | null> {
        const user:OutputUserType | null = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user){
            return null
        }
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt);
        if (user.accountData.passwordHash !== passwordHash){
            return null
        }

        return user
    },
    async _generateHash(password:string, salt:string):Promise<string>{
        const hash = await bcrypt.hash(password, salt);
        return hash
    }

}