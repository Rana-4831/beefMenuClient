export type Category = {
  id: string
  icon: string
  name: { fa: string; en: string; tr: string }
  description: { fa: string; en: string; tr: string }
}

export const categories: Category[] = [
  {
    id: 'all',
    icon: 'all',
    name: { fa: 'همه‌ی محصولات', en: 'All Items', tr: 'Tüm Ürünler' },
    description: { fa: 'مواد تازه. طعم عالی.', en: 'Fresh ingredients. Great taste.', tr: 'Taze malzemeler. Harika lezzet.' },
  },
  {
    id: 'pizza',
    icon: 'pizza',
    name: { fa: 'پیتزا', en: 'Pizza', tr: 'Pizza' },
    description: { fa: 'پیتزای تازه با خمیر دست‌ساز.', en: 'Fresh pizza with hand-made dough.', tr: 'El yapımı hamurla taze pizzalar.' },
  },
  {
    id: 'pasta',
    icon: 'pasta',
    name: { fa: 'پاستا', en: 'Pasta', tr: 'Makarna' },
    description: { fa: 'پاستای کremی با سس آلفredo.', en: 'Creamy pasta with Alfredo sauce.', tr: 'Alfredo soslu kremalı makarna.' },
  },
  {
    id: 'burger',
    icon: 'burger',
    name: { fa: 'برگر', en: 'Burger', tr: 'Burger' },
    description: { fa: 'برگر گوشت با پنیر چدار.', en: 'Beef burger with cheddar.', tr: 'Cheddar peynirli dana burger.' },
  },
  {
    id: 'salad',
    icon: 'salad',
    name: { fa: 'سالاد', en: 'Salad', tr: 'Salata' },
    description: { fa: 'سبزیجات تازه و سس مخصوص.', en: 'Fresh vegetables and house dressing.', tr: 'Taze sebzeler ve özel sos.' },
  },
  {
    id: 'drinks',
    icon: 'drinks',
    name: { fa: 'نوشیدنی', en: 'Drinks', tr: 'İçecekler' },
    description: { fa: 'نوشیدنی‌های سرد و گرم.', en: 'Cold and hot drinks.', tr: 'Soğuk ve sıcak içecekler.' },
  },
]
