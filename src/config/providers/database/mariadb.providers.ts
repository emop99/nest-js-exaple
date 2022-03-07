import {createConnection} from "typeorm";

export const MariadbProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () => await createConnection({
            type: 'mariadb',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: process.env.DB_SYNCHRONIZE === '1',
            logging: process.env.DB_LOGGING === '1',
            charset: 'utf8mb4_unicode_ci',
            entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        })
    }
]
