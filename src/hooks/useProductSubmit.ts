"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import {useRouter} from 'next/navigation';
import { useAddProductMutation, useEditProductMutation } from "@/redux/product/productApi";
import { notifyError, notifySuccess } from "@/utils/toast";

// ImageURL type
export interface ImageURL {
  color: {
    name?: string;
    clrCode?: string;
  };
  img: string;
  sizes?: string[];
}
type IBrand = {
  name: string;
  id: string;
};
type ICategory = {
  name: string;
  id: string;
};

type status = "in-stock" | "out-of-stock" | "discontinued";

const useProductSubmit = () => {
  const [sku, setSku] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [imageURLs, setImageURLs] = useState<ImageURL[]>([]);
  const [parent, setParent] = useState<string>("");
  const [children, setChildren] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [brand, setBrand] = useState<IBrand>({ name: "", id: "" });
  const [category, setCategory] = useState<ICategory>({ name: "", id: "" });
  const [status, setStatus] = useState<status>("in-stock");
  const [productType, setProductType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const [offerDate, setOfferDate] = useState<{
    startDate: null;
    endDate: null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [additionalInformation, setAdditionalInformation] = useState<
    {
      key: string;
      value: string;
    }[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const router = useRouter();


  // useAddProductMutation
  const [addProduct, { data: addProductData, isError, isLoading }] =
    useAddProductMutation();
  // useAddProductMutation
  const [editProduct, { data: editProductData, isError: editErr, isLoading: editLoading }] =
    useEditProductMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm();
  // resetForm
  const resetForm = () => {
    setSku("");
    setImg("");
    setTitle("");
    setSlug("");
    setUnit("");
    setImageURLs([]);
    setParent("");
    setChildren("");
    setPrice(0);
    setDiscount(0);
    setQuantity(0);
    setBrand({ name: "", id: "" });
    setCategory({ name: "", id: "" });
    setStatus("in-stock");
    setProductType("");
    setDescription("");
    setVideoId("");
    setOfferDate({
      startDate: null,
      endDate: null,
    });
    setAdditionalInformation([]);
    setTags([]);
    setSizes([]);
    reset();
  };

  // handle submit product
  const handleSubmitProduct = async (data: any) => {
    // console.log("product data--->", data);

    // product data
    const productData = {
      sku: data.SKU,
      img: img,
      title: data.title,
      slug: slugify(data.title, { replacement: "-", lower: true }),
      unit: data.unit,
      imageURLs: imageURLs,
      parent: parent,
      children: children,
      price: data.price,
      discount: data.discount_percentage,
      quantity: data.quantity,
      brand: brand,
      category: category,
      status: status,
      offerDate: {
        startDate: offerDate.startDate,
        endDate: offerDate.endDate,
      },
      productType: productType,
      description: data.description,
      videoId: data.youtube_video_Id,
      additionalInformation: additionalInformation,
      tags: tags,
    };

    console.log('productData-------------------..>',productData)


    if (!img) {
      return notifyError("Product image is required");
    }
    if (!category.name) {
      return notifyError("Category is required");
    }
    if (Number(data.discount) > Number(data.price)) {
      return notifyError("Product price must be gether than discount");
    } else {
      const res = await addProduct(productData);
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
      } else {
        notifySuccess("Product created successFully");
        setIsSubmitted(true);
        resetForm();
        router.push('/product-grid')
      }
    }
  };
  // handle edit product
  const handleEditProduct = async (data: any, id: string) => {
    // product data
    const productData = {
      sku: data.SKU,
      img: img,
      title: data.title,
      slug: slugify(data.title, { replacement: "-", lower: true }),
      unit: data.unit,
      imageURLs: imageURLs,
      parent: parent,
      children: children,
      price: data.price,
      discount: data.discount_percentage,
      quantity: data.quantity,
      brand: brand,
      category: category,
      status: status,
      offerDate: {
        startDate: offerDate.startDate,
        endDate: offerDate.endDate,
      },
      productType: productType,
      description: data.description,
      videoId: data.youtube_video_Id,
      additionalInformation: additionalInformation,
      tags: tags,
    };
    console.log('edit productData---->',productData)
    const res = await editProduct({ id: id, data: productData });
    if ("error" in res) {
      if ("data" in res.error) {
        const errorData = res.error.data as { message?: string };
        if (typeof errorData.message === "string") {
          return notifyError(errorData.message);
        }
      }
    } else {
      notifySuccess("Product edit successFully");
      setIsSubmitted(true);
      router.push('/product-grid')
      resetForm();
    }
  };

  return {
    sku,
    setSku,
    img,
    setImg,
    title,
    setTitle,
    slug,
    setSlug,
    unit,
    setUnit,
    imageURLs,
    setImageURLs,
    parent,
    setParent,
    children,
    setChildren,
    price,
    setPrice,
    discount,
    setDiscount,
    quantity,
    setQuantity,
    brand,
    setBrand,
    category,
    setCategory,
    status,
    setStatus,
    productType,
    setProductType,
    description,
    setDescription,
    videoId,
    setVideoId,
    additionalInformation,
    setAdditionalInformation,
    tags,
    setTags,
    sizes,
    setSizes,
    handleSubmitProduct,
    handleEditProduct,
    register,
    handleSubmit,
    errors,
    control,
    offerDate,
    setOfferDate,
    setIsSubmitted,
    isSubmitted,
  };
};

export default useProductSubmit;
