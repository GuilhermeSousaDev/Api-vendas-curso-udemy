import { ICreateCustomer } from "../models/ICreateCustomer";
import { ICustomer } from "../models/ICustomer";

export interface ICustomersRepository {
    find(): Promise<ICustomer[]>;
    findByEmail(email: string): Promise<ICustomer | undefined>;
    findByName(name: string): Promise<ICustomer | undefined>;
    findById(id: string): Promise<ICustomer | undefined>;
    remove(customer: ICustomer): Promise<void>;
    create(data: ICreateCustomer): Promise<ICustomer>;
    save(customer: ICustomer): Promise<ICustomer>;
}
