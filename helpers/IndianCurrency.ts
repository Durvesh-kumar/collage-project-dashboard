
const IndianCurrency = (price:any)=>{
    const numberFormat = Intl.NumberFormat("en-In", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    })
    return numberFormat.format(price)
}

export default IndianCurrency;