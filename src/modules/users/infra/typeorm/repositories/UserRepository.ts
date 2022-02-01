import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { EntityRepository, Repository } from 'typeorm'
import User from "../entitites/User";

@EntityRepository(User)
export default class UserRepository
    extends Repository<User>
    implements IUsersRepository {
    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.findOne({ where: { email } })

        return user;
    }

    public async findByName(name: string): Promise<User | undefined> {
        const user = await this.findOne({ where: { name }})

        return user;
    }

    public async findById(id: number): Promise<User | undefined> {
        const user = await this.findOne({ where: { id }})

        return user;
    }
}


