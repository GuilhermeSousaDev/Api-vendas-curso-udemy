import { getCustomRepository } from 'typeorm'
import AppError from '@shared/errors/AppError'
import Order from '../infra/typeorm/entities/Orders'
import OrdersRepository from '../infra/typeorm/repositories/OrdersRepository'
import ProductRepository from '@modules/products/infra/typeorm/repositories/Products.repository'
import { CustomerRepository } from '@modules/customers/infra/typeorm/repositories/CustomerRepository'

interface IProduct {
    id: string;
    quantity: number;
}

interface IRequest {
    customer_id: string;
    products: IProduct[];
}

export default class CreateOrderService {
    public async execute({ customer_id, products }: IRequest): Promise<Order> {
        const ordersRepository = getCustomRepository(OrdersRepository);
        const customerRepository = getCustomRepository(CustomerRepository);
        const productsRepository = getCustomRepository(ProductRepository);

        const customerExists = await customerRepository.findById(customer_id);

        if(!customerExists) {
            throw new AppError('Could not find any customer with the given id.');
        }

        const existsProducts = await productsRepository.findAllByIds(products);

        if(!existsProducts.length) {
            throw new AppError('Could not find any products with the given ids.');
        }

        const existsProductsIds = existsProducts.map(product => product.id);

        const checkInexistentProducts = products.filter(
            product => !existsProductsIds.includes(Number(product.id))
        );

        if(checkInexistentProducts.length) {
            throw new AppError(`Could not find product ${checkInexistentProducts[0]}.`);
        }

        const quantityAvailabe = products.filter(
            product => existsProducts.filter(p => p.id === Number(product.id))[0].quantity < product.quantity
        );

        if(quantityAvailabe.length) {
            throw new AppError(
                `The quantity ${quantityAvailabe[0].quantity} is not available for
                ${quantityAvailabe[0].id}`
            );
        }

        const serializedProducts = products.map(product => ({
            product_id: product.id,
            quantity: product.quantity,
            price: existsProducts.filter(p => p.id === Number(product.id))[0].price
        }))

        const order = await ordersRepository.createOrder({
            customer: customerExists,
            products: serializedProducts
        })

        const { order_products } = order;

        const updatedProductQuantity = order_products.map(
            product => ({
                id: product.product_id,
                quantity: existsProducts.filter(p => p.id === Number(product.product_id))[0].quantity - product.quantity
            })
        );

        await productsRepository.save(updatedProductQuantity);

        return order;
    }
}
