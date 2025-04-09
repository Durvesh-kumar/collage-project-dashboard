// "use client"
// import { Button } from "@/components/ui/button"
// import { Star } from "lucide-react"
// import { useSession } from "next-auth/react"
// import Image from "next/image"
// import { useEffect, useState } from "react"
// import toast from "react-hot-toast"

// interface ReviewsPropes {
//     productId: any
// }
// const Reviews: React.FC<ReviewsPropes> = ({ productId }) => {

//     const { data }: { data: any } = useSession();
//     const [reviews, setReviews] = useState([])

//     const getReviews = async () => {
//         try {
//             const res = await fetch(`/api/products/${productId}/reviews`, {
//                 method: "GET"
//             })

//             if (res.ok) {
//                 const data = await res.json()
//                 setReviews(data)
//             }
//         } catch (error) {
//             console.log("[Reviews_DELETE", error);
//             toast.error("Somthing went wrong! Please try agian")
//         }
//     }

//     const deleteReview = async (reviewId: string) => {
//         try {
//             const res = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
//                 method: "DELETE"
//             })

//             if (res.ok) {
//                 toast.success("Review deleted successfully")
//             }
//         } catch (error) {
//             console.log("[Reviews_DELETE", error);
//             toast.error("Somthing went wrong! Please try agian")
//         }
//     }

//     useEffect(() => {
//         getReviews()
//     }, [])
//     return (
//         <div className="px-4">
//             {
//                 reviews?.length > 0 && (
//                     <div>
//                         <hr className="py-[1px] bg-gray-900 shadow-md my-6" />
//                         <div className="flex gap-8 justify-center flex-wrap mx-auto">
//                             {
//                                 reviews.map((review: ReviewsType) => (
//                                     <div key={review._id} className="bg-white p-2 shadow-lg  rounded-xl w-1/3 max-lg:w-full">
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center gap-4">
//                                                 <Image
//                                                     src={review.image}
//                                                     alt="image"
//                                                     height={1000}
//                                                     width={1000}
//                                                     className="h-12 w-12 object-scale-down mix-blend-multiply rounded-full border-2 border-black"
//                                                 />
//                                                 <div>
//                                                     <div>
//                                                         <h3 className="font-medium text-sm">{review.email}</h3>
//                                                         <h4 className="font-medium text-slate-600 text-sm">@{review.name}</h4>
//                                                     </div>

//                                                     <div className=" flex gap-1 mt-1">
//                                                         {
//                                                             [...Array(Number(review.rating))].map((star, index: number) =>
//                                                                 <Star
//                                                                     key={index}
//                                                                     fill="yellow"
//                                                                     color="#5CB002"
//                                                                     className="w-4 h-4"
//                                                                 />
//                                                             )
//                                                         }
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             {
//                                                 data?.role === "Owner" && (
//                                                     <Button
//                                                         onClick={() => deleteReview(review._id)}
//                                                         className="bg-red-500 text-white hover:bg-white hover:text-black border-2
//                                                      hover:border-black"
//                                                     >
//                                                         Delete
//                                                     </Button>
//                                                 )
//                                             }
//                                         </div>
//                                         <p className="mt-2">{review.message}</p>
//                                     </div>
//                                 ))
//                             }
//                         </div>
//                     </div>
//                 )
//             }


//         </div>
//     )
// }

// export default Reviews