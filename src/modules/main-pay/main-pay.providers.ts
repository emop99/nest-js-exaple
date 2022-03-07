import {Connection} from "typeorm";
import {MainPayResponseEntity} from "../../entity/main-pay-response.entity";
import {MainPayBillKeyEntity} from "../../entity/main-pay-bill-key.entity";

export const MainPayProviders = [
    {
        provide: 'MAIN_PAY_RESPONSE_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(MainPayResponseEntity),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: 'MAIN_PAY_BILL_KEY_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(MainPayBillKeyEntity),
        inject: ['DATABASE_CONNECTION'],
    },
]
