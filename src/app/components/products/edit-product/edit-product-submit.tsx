"use client";
import React from "react";
import useProductSubmit from "@/hooks/useProductSubmit";
import ErrorMsg from "../../common/error-msg";
import FormField from "../form-field";
import DescriptionTextarea from "../add-product/description-textarea";
import { useGetProductQuery } from "@/redux/product/productApi";
import OfferDatePicker from "../add-product/offer-date-picker";
import ProductTypeBrand from "../add-product/product-type-brand";
import AdditionalInformation from "../add-product/additional-information";
import ProductVariants from "../add-product/product-variants";
import ProductImgUpload from "../add-product/product-img-upload";
import Tags from "../add-product/tags";
import ProductCategory from "../../category/product-category";

const EditProductSubmit = ({ id }: { id: string }) => {
  const { data: product, isError, isLoading } = useGetProductQuery(id);
  const {
    handleSubmit,
    handleSubmitProduct,
    register,
    errors,
    tags,
    setTags,
    setSizes,
    sizes,
    setAdditionalInformation,
    control,
    setCategory,
    setParent,
    setChildren,
    setImg,
    img,
    setBrand,
    setProductType,
    imageURLs,
    setImageURLs,
    offerDate,
    setOfferDate,
    isSubmitted,
    setIsSubmitted,
    handleEditProduct,
  } = useProductSubmit();

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && product) {
    content = (
      <form onSubmit={handleSubmit((data) => handleEditProduct(data, id))}>
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* left side */}
          <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
            <div className="mb-6 bg-white px-8 py-8 rounded-md">
              <h4 className="text-[22px]">General</h4>
              <FormField
                title="title"
                isRequired={true}
                placeHolder="Product Title"
                register={register}
                errors={errors}
                defaultValue={product.title}
              />
              <DescriptionTextarea
                register={register}
                errors={errors}
                defaultValue={product.description}
              />
            </div>

            <div className="bg-white px-8 py-8 rounded-md mb-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6">
                <FormField
                  title="price"
                  isRequired={true}
                  placeHolder="Product price"
                  bottomTitle="Set the base price of product."
                  type="number"
                  defaultValue={product.price}
                  register={register}
                  errors={errors}
                />
                <FormField
                  title="SKU"
                  isRequired={true}
                  placeHolder="SKU"
                  bottomTitle="Enter the product SKU."
                  defaultValue={product.sku}
                  register={register}
                  errors={errors}
                />
                <FormField
                  title="quantity"
                  isRequired={true}
                  placeHolder="Quantity"
                  bottomTitle="Enter the product quantity."
                  type="number"
                  defaultValue={product.quantity}
                  register={register}
                  errors={errors}
                />
                <FormField
                  title="discount percentage"
                  type="number"
                  isRequired={false}
                  placeHolder="Discount"
                  bottomTitle="Set the product Discount."
                  defaultValue={product.discount}
                  register={register}
                  errors={errors}
                />
              </div>
            </div>

            <div className="bg-white px-8 py-8 rounded-md mb-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-x-6">
                <FormField
                  title="youtube video Id"
                  isRequired={false}
                  placeHolder="video id"
                  bottomTitle="Set the video id of product."
                  defaultValue={product.videoId}
                  register={register}
                  errors={errors}
                />
                {/* date picker start */}
                <div>
                  <p className="mb-0 text-base text-black capitalize">
                    start and end date
                  </p>
                  <OfferDatePicker
                    offerDate={offerDate}
                    setOfferDate={setOfferDate}
                    defaultValue={product.offerDate}
                  />
                  <span className="text-tiny leading-4">
                    set the product offer and end date
                  </span>
                </div>
                {/* date picker start */}
              </div>
            </div>

            {/* product type and brands start */}
            <ProductTypeBrand
              register={register}
              errors={errors}
              control={control}
              setSelectBrand={setBrand}
              setSelectProductType={setProductType}
              default_value={{
                brand: product.brand.name,
                product_type: product.productType,
                unit: product.unit,
              }}
            />
            {/* product type and brands end */}

            {/* additional information page start */}
            <AdditionalInformation
              setAdditionalInformation={setAdditionalInformation}
              default_value={product.additionalInformation}
            />
            {/* additional information page end */}

            {/* product variations start */}
            <ProductVariants
              isSubmitted={isSubmitted}
              setImageURLs={setImageURLs}
              default_value={product.imageURLs}
            />
            {/* product variations end */}
          </div>

          {/* right side */}
          <div className="col-span-12 xl:col-span-4 2xl:col-span-3">
            <ProductImgUpload
              imgUrl={img}
              setImgUrl={setImg}
              default_img={product.img}
              isSubmitted={isSubmitted}
            />

            <div className="bg-white px-8 py-8 rounded-md mb-6">
              <p className="mb-5 text-base text-black">Product Category</p>
              {/* category start */}
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 mb-5">
                <ProductCategory
                  setCategory={setCategory}
                  setParent={setParent}
                  setChildren={setChildren}
                  default_value={{
                    parent: product.category.name,
                    id: product.category.id,
                    children: product.children,
                  }}
                />
                <Tags
                  tags={tags}
                  setTags={setTags}
                  default_value={product.tags}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="tp-btn px-5 py-2 mt-5" type="submit">
          Submit Product
        </button>
      </form>
    );
  }

  return <>{content}</>;
};

export default EditProductSubmit;
