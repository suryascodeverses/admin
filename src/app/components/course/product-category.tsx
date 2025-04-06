"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useGetAllCategoriesQuery } from "@/redux/category/categoryApi";
import ErrorMsg from "../common/error-msg";

// prop type
type IPropType = {
  setCategory: React.Dispatch<SetStateAction<{ name: string; id: string }>>;
  setParent: React.Dispatch<SetStateAction<string>>;
  setChildren: React.Dispatch<SetStateAction<string>>;
  default_value?: {
    parent: string;
    id: string;
    children: string;
  };
};

export default function ProductCategory({
  setCategory,
  setParent,
  setChildren,
  default_value,
}: IPropType) {
  const [open, setOpen] = React.useState<string>("");
  const { data: categories, isError, isLoading } = useGetAllCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    default_value ? [default_value.parent, default_value.children] : []
  );

  useEffect(() => {
    if (default_value?.parent && default_value.id && default_value.children) {
      const { id, parent, children } = default_value;
      setCategory({ id: id, name: parent });
      setParent(parent);
      setChildren(children);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handleCategory
  const handleCategory = (value: string, title: string) => {
    setOpen(open === value ? "" : value);
    if (value && title) {
      setCategory({ id: value, name: title });
      setParent(title);
    }
    if (title) {
      if (selectedCategory.includes(title)) {
        setSelectedCategory(selectedCategory.filter((c) => c !== title));
      } else {
        setSelectedCategory([...selectedCategory, title]);
      }
    }
  };

  // handle sub category
  const handleSubCategory = (subCate: string) => {
    setChildren(subCate);
    if (selectedCategory.includes(subCate)) {
      setSelectedCategory(selectedCategory.filter((c) => c !== subCate));
    } else {
      setSelectedCategory([...selectedCategory, subCate]);
    }
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result.length === 0) {
    content = <ErrorMsg msg="No Category Found" />;
  }

  if (!isLoading && !isError && categories?.success) {
    const categoryItems = categories.result;

    content = (
      <>
        <List className="p-0">
          {categoryItems.map((item) => (
            <Accordion
              key={item._id}
              open={open === item._id}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === item._id ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={open === item._id}>
                <AccordionHeader
                  onClick={() => handleCategory(item._id, item.parent)}
                  className="border-b-0 p-3"
                >
                  <Typography
                    color="blue-gray"
                    className="mr-auto font-normal mb-0"
                  >
                    {item.parent}
                  </Typography>
                </AccordionHeader>
              </ListItem>
              {item.children.length > 0 && (
                <AccordionBody className="py-1 ml-4">
                  <List className="p-0">
                    {item.children.map((sub: string, i: number) => (
                      <ListItem key={i} onClick={() => handleSubCategory(sub)}>
                        {sub}
                      </ListItem>
                    ))}
                  </List>
                </AccordionBody>
              )}
            </Accordion>
          ))}
        </List>
      </>
    );
  }

  return (
    <>
      <div className="tags-input-wrapper mb-2">
        {selectedCategory.map((c, i) => (
          <span key={i} className="tag">
            {c}
            <b onClick={() => handleCategory("", c)}>×</b>
          </span>
        ))}
      </div>
      <div className="h-80 overflow-y-scroll overflow-x-hidden">
        <Card>{content}</Card>
      </div>
    </>
  );
}
