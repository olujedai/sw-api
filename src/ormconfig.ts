import { ConnectionOptions } from 'typeorm';

console.log(String(process.env.DATABASE_HOST));
export const config: ConnectionOptions = {
    type: 'postgres',
    host: String(process.env.DATABASE_HOST),
    port: Number(process.env.DATABASE_PORT),
    username: String(process.env.DATABASE_USER),
    password: String(process.env.DATABASE_PASSWORD),
    database: String(process.env.DATABASE_NAME),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/migrations',
    },
};
