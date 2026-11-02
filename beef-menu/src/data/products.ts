import type { Language } from '../i18n'

export type Localized = Record<Language, string>

export interface Product {
    id: string
    categoryId: string
    name: Localized
    description: Localized
    price: number
    available: boolean
    image?: string
}

export const products: Product[] = [
    {
        id: 'p1',
        categoryId: 'pizza',
        name: { fa: 'پیتزا مارگاریتا', en: 'Margherita Pizza', tr: 'Margherita Pizza' },
        description: {
            fa: 'پنیر موزارلا، گوجه‌ی تازه و ریحان.',
            en: 'Mozzarella, fresh tomato and basil.',
            tr: 'Mozzarella, taze domates ve fesleğen.',
        },
        price: 250000,
        available: true,
        image: '/images/products/pizza-margherita.webp',

    },
    {
        id: 'p2',
        categoryId: 'pasta',
        name: { fa: 'پاستای آلفردو', en: 'Alfredo Pasta', tr: 'Alfredo Makarna' },
        description: {
            fa: 'پاستای خامه‌ای با سس آلفردو.',
            en: 'Creamy pasta with Alfredo sauce.',
            tr: 'Alfredo sosuyla kremalı makarna.',
        },
        price: 180000,
        available: true,
        image: '/images/products/pasta-alfredo.webp',


    },
    {
        id: 'p3',
        categoryId: 'burger',
        name: { fa: 'همبرگر ویژه', en: 'Special Burger', tr: 'Özel Burger' },
        description: {
            fa: 'گوشت گاو، چدار و سس مخصوص.',
            en: 'Beef, cheddar and house sauce.',
            tr: 'Dana eti, cheddar ve özel sos.',
        },
        price: 220000,
        available: false,
    },
    {
        id: 'p4',
        categoryId: 'main',
        name: { fa: 'استیک فیله', en: 'Fillet Steak', tr: 'Fileto Biftek' },
        description: {
            fa: 'فیله‌ی گوساله با سیب‌زمینی کوره‌ای.',
            en: 'Veal fillet with oven potatoes.',
            tr: 'Fırında patatesli dana fileto.',
        },
        price: 420000,
        available: true,
    },
]
