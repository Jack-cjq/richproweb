import { DataSource } from 'typeorm'
import { ExchangeRate } from './entities/ExchangeRate'
import { Product } from './entities/Product'
import { Trade } from './entities/Trade'
import { Admin } from './entities/Admin'
import { Content } from './entities/Content'
import { SupportedCard } from './entities/SupportedCard'
import { Carousel } from './entities/Carousel'
import { SystemConfig } from './entities/SystemConfig'
import { ConversionConfig } from './entities/ConversionConfig'
import { CompanyImage } from './entities/CompanyImage'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'giftcard',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [ExchangeRate, Product, Trade, Admin, Content, SupportedCard, Carousel, SystemConfig, ConversionConfig, CompanyImage],
  migrations: ['src/migrations/**/*.ts'],
})

