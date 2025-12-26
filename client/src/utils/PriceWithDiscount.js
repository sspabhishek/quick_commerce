export const pricewithDiscount = (price, dis = 1) => {
    if (!price) return 0;
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}