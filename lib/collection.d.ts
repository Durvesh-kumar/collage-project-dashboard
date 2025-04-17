
interface CollectionType {
    createdAt: string | number | Date
    id: string,
    userId: DashboardUserType,
    title: string,
    description: string,
    image: string,
    address: string,
    products?: ProductType[] |null
    country: string,
    city: string,
    state: string,
    phoneNo: string,
    pinCode: string,
    createdAt: string,
    updatedAt: string
}