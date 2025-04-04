import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Rating } from "react-simple-star-rating";
import { IProduct } from "@/types/product-type";
import DeleteReviews from "./delete-reviews";

const ReviewItem = ({ item }: { item: IProduct }) => {
  // console.log('review-item',item)
  const averageRating =
    item.reviews && item.reviews?.length > 0
      ? item.reviews.reduce((acc, review) => acc + review.rating, 0) /
        item.reviews.length
      : 0;
  return (
    <tr
      key={item._id}
      className="bg-white border-b border-gray6 last:border-0 text-start mx-9"
    >
      <td className="pr-8 py-5 whitespace-nowrap">
        <a href="#" className="flex items-center space-x-5">
          <Image
            className="w-[60px] h-[60px] rounded-md"
            src={item.img}
            alt="product-img"
            width={282}
            height={300}
          />
          <span className="font-medium text-heading text-hover-primary transition">
            {item.title}
          </span>
        </a>
      </td>
      <td className="px-3 py-3 font-normal text-heading text-end">
        <div className="flex justify-end items-center space-x-1 text-tiny">
          <span className="text-yellow flex items-center space-x-1">
            <Rating
              allowFraction
              size={18}
              initialValue={averageRating}
              readonly={true}
            />
          </span>
          <span>{averageRating}</span>
        </div>
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] text-end">
        {dayjs(item.updatedAt).format("MMM D, YYYY h:mm A")}
      </td>
      <td className="px-9 py-3 text-end">
        <DeleteReviews id={item._id} />
      </td>
    </tr>
  );
};

export default ReviewItem;
