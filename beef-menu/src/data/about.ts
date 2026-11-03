export interface AboutText {
    fa?: string
    en?: string
    tr?: string
}

export interface AboutInfo {
    about: AboutText | null
}

// mock برای تست بک‌اند؛ بعداً از API میاد
// اگه about خالی باشه یا null باشه، شیت فقط پیام «پیامی برای نمایش وجود ندارد» رو نشون میده
export const aboutMock: AboutInfo = {
    about: {
        fa: 'ما با یک هدف ساده شروع کردیم: غذایی بسازیم که خوشمزه باشه و با مواد تازه تهیه بشه. سبمنزسدزدرینبریذرتایبذرتیبذریاتبذراتبیرذاتبیذراتیبذراتیبذراتیبذراتذیبراتبیذربیاترذاتبیذرتابیذ',
        en: 'We started with one simple goal: to make food that tastes great and uses fresh ingredients.',
        tr: 'Tek bir hedefle başladık: lezzetli ve taze malzemelerle yemekler hazırlamak.',
    },
}
