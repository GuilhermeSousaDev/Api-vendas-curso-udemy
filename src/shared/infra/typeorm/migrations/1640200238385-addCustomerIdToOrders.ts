import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class addCustomerIdToOrders1640200238385 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('orders',
        new TableColumn({
                name: 'customer_id',
                type: 'int',
                isNullable: true
            }
        ));

        await queryRunner.createForeignKey('orders', new TableForeignKey({
            name: 'OrdersCustomer',
            columnNames: ['customer_id'],
            referencedTableName: 'customers',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('orders', 'OrdersCustomer');
        await queryRunner.dropColumn('orders', 'customer_id');
    }

}
