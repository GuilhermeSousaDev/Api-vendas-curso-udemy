import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs'
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entitites/User';
import UserRepository from '../typeorm/repositories/UserRepository';
import uploadConfig from '@config/upload';
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider';

interface IRequest {
    user_id: number;
    avatarFilename: string;
}

export default class UpdateUserAvatarService {
    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        const userRepository = getCustomRepository(UserRepository);
        const storageProvider = new DiskStorageProvider();

        const user = await userRepository.findById(user_id)

        if(!user) {
            throw new AppError('User not found')
        }

        if(user.avatar) {
            await storageProvider.deleteFile(user.avatar);
        }

        const filename = await storageProvider.saveFile(avatarFilename);

        user.avatar = filename;

        await userRepository.save(user)

        return user;
    }
}

