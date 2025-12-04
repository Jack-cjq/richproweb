import { Router } from 'express'
import { ExchangeRateController } from '../controllers/ExchangeRateController'
import { ProductController } from '../controllers/ProductController'
import { TradeController } from '../controllers/TradeController'
import { ContentController } from '../controllers/ContentController'
import { SupportedCardController } from '../controllers/SupportedCardController'
import { CarouselController } from '../controllers/CarouselController'
import { ConversionConfigController } from '../controllers/ConversionConfigController'
import { CompanyImageController } from '../controllers/CompanyImageController'
import { validatePagination } from '../middleware/validator'

const router = Router()

// 汇率 - 后端处理所有数据逻辑
router.get('/exchange-rates', ExchangeRateController.getPublic)

// 产品 - 后端只返回激活状态的产品
router.get('/products', ProductController.getPublic)
router.get('/products/:id', ProductController.getById) // 获取单个产品详情

// 交易记录 - 后端处理分页和筛选
router.get('/trades', validatePagination, TradeController.getPublic)

// 内容
router.get('/content', ContentController.getPublic)

// 支持的礼品卡 - 后端只返回激活的卡片
router.get('/supported-cards', SupportedCardController.getPublic)

// 轮播图 - 后端只返回激活的轮播图
router.get('/carousels', CarouselController.getPublic)

// 公司图片 - 后端只返回激活的公司图片
router.get('/company-images', CompanyImageController.getPublic)

// 换算配置
router.get('/conversion-config', ConversionConfigController.getPublic)

export default router

