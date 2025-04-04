import React, { useState, useEffect } from "react";
import Sizes from "./sizes";
import { ImageURL } from "@/hooks/useProductSubmit";
import { notifyError, notifySuccess } from "@/utils/toast";
import VariantImgUpload from "./variant-img-upload";
import { SmClose } from "@/svg";

// prop type
type IPropType = {
  isSubmitted: boolean;
  setImageURLs: React.Dispatch<React.SetStateAction<ImageURL[]>>;
  default_value?: ImageURL[];
};

const ProductVariants = ({
  isSubmitted,
  setImageURLs,
  default_value,
}: IPropType) => {
  const [uploadImg, setUploadImg] = useState<string>("");
  const [formData, setFormData] = useState<ImageURL[]>(
    default_value
      ? default_value
      : [{ color: { clrCode: "", name: "" }, img: "", sizes: [] }]
  );
  const [isSubmitField, setIsSubmitField] = useState<boolean>(false);
  // set default value
  const [hasDefaultValues, setHasDefaultValues] = useState<boolean>(false);
  // default value set
  useEffect(() => {
    if (default_value && !hasDefaultValues) {
      setImageURLs(default_value);
      setHasDefaultValues(true);
    }
  }, [default_value, hasDefaultValues, setImageURLs, formData]);
  // handle add field
  const handleAddField = () => {
    const allFieldsNotEmpty = formData.every((field) => field.img);
    if (allFieldsNotEmpty) {
      setFormData((prevFormData) => [
        ...prevFormData,
        { color: { clrCode: "", name: "" }, img: "", sizes: [] },
      ]);
      setImageURLs(formData);
    } else {
      notifyError("Image required");
    }
  };
  // handle size change
  const handleSizeChange = (sizes: string[], index: number) => {
    const updatedFormData = [...formData];
    updatedFormData[index].sizes = sizes;
    setFormData(updatedFormData);
    setImageURLs(updatedFormData);
  };
  // handle remove product
  const handleRemoveProduct = (index: number) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
    setImageURLs(updatedFormData);
  };
  // handle submit field
  // const handleSubmitField = () => {
  //   const allFieldsValid = formData.every((field) => field.img?.trim() !== "");
  //   if (allFieldsValid) {
  //     setImageURLs(formData);
  //     notifySuccess("variant field added");
  //     setIsSubmitField(true);
  //     setFormData([{ color: { clrCode: "", name: "" }, img: "", sizes: [] }]);
  //   } else {
  //     notifyError("Image required");
  //   }
  // };
  // col
  const col = formData.length > 1 ? 3 : 2;

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <h4 className="text-[22px]">Product Variations</h4>
      {formData.map((field, i) => (
        <div key={i} className="mt-10 pt-10 border-t border-gray relative">
           {i !== 0 && (
              <div className="text-end">
                <button
                  className="h-[44px] w-[44px] rounded-md border border-gray6 hover:border-red "
                  type="button"
                  onClick={() => handleRemoveProduct(i)}
                >
                  <SmClose />
                </button>
              </div>
            )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-x-6">
            <div className="mb-5">
              <p className="mb-0 text-base text-black">Color Name</p>
              <input
                id="clrName"
                className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
                type="text"
                placeholder="Color Name"
                value={field?.color?.name}
                onChange={(e) => {
                  const updatedFormData = [...formData];
                  updatedFormData[i] = {
                    ...updatedFormData[i],
                    color: {
                      ...updatedFormData[i].color,
                      name: e.target.value,
                    },
                  };
                  setFormData(updatedFormData);
                  setImageURLs(updatedFormData);
                }}
              />
              <span className="text-tiny leading-4">
                Set the Color name of product.
              </span>
            </div>

            <div className="mb-5">
              <p className="mb-0 text-base text-black">Color Code</p>
              <input
                id="clrCode"
                className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
                type="text"
                placeholder="Color Code"
                value={field?.color?.clrCode}
                onChange={(e) => {
                  const updatedFormData = [...formData];
                  updatedFormData[i].color.clrCode = e.target.value;
                  setFormData(updatedFormData);
                  setImageURLs(updatedFormData);
                }}
              />
              <span className="text-tiny leading-4">
                Hex code here ex:#3C3C3D
              </span>
            </div>
          </div>

          <div
            className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-x-6`}
          >
            <Sizes
              handleSizeChange={handleSizeChange}
              field={field}
              index={i}
            />
            <VariantImgUpload
              setFormData={setFormData}
              setImageURLs={setImageURLs}
              index={i}
              formData={formData}
              isSubmitField={isSubmitField}
              isSubmitted={isSubmitted}
              setIsSubmitField={setIsSubmitField}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between flex-wrap">
        <button
          className="tp-btn px-5 py-2 mt-5"
          type="button"
          onClick={handleAddField}
        >
          Add Field
        </button>
        {/* <button
          className="tp-btn px-5 py-2 mt-5"
          type="button"
          onClick={handleSubmitField}
        >
          Submit Field
        </button> */}
      </div>
    </div>
  );
};

export default ProductVariants;
