import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import UserRepository from '../typeorm/repositories/UserRepository'
import UserTokenRepository from '../typeorm/repositories/UserTokenRepository'

interface IRequest {
    email: string;
}

export default class SendForgotPasswordEmailService {
    public async execute({ email }: IRequest): Promise<void> {
        const userRepository = getCustomRepository(UserRepository)
        const userTokenRepository = getCustomRepository(UserTokenRepository)

        const user = userRepository.findByEmail(email);

        if(!user) {
            throw new AppError('User does not exists')
        }

        const token = await userTokenRepository.generate((await user).id)

        console.log(token)
    }
}
