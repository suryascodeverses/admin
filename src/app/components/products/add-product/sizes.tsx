import { ImageURL } from "@/hooks/useProductSubmit";
import { TagsInput } from "react-tag-input-component";

const Sizes = ({
  field,
  handleSizeChange,
  index,
}: {
  handleSizeChange: (sizes: string[], index: number) => void;
  index:number;
  field:ImageURL
}) => {
  return (
    <div className="mb-5">
      <p className="mb-0 text-base text-black">Sizes</p>
      <TagsInput
        value={field.sizes}
        onChange={(sizes) => handleSizeChange(sizes, index)}
        name={`sizes-${index}`}
        placeHolder="enter sizes"
      />
      {/* <em>press enter or comma to add new size</em> */}
      <span className="text-tiny leading-4">
        press enter to add new size
      </span>
    </div>
  );
};

export default Sizes;
