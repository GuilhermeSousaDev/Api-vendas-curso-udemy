import { getCustomRepository } from 'typeorm'
import Product from '../infra/typeorm/entities/Product'
import ProductRepository from '../infra/typeorm/repositories/Products.repository'
import AppError from '@shared/errors/AppError'

interface IRequest {
    id: number | string;
}

class ShowProductServices {
    public async execute({ id }: IRequest): Promise<Product | undefined> {
        const productRepository = getCustomRepository(ProductRepository)

        const product = await productRepository.findOne(id)

        if(!product) {
            throw new AppError('Product not found')
        }

        return product;
    }
}

export default ShowProductServices;
