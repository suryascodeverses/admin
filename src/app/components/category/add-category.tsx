"use client";
import { notifyError, notifySuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
// Add these if not already available
// import { notifySuccess, notifyError } from "@/utils/notify"; // Adjust this import path to your project

const base_api = process.env.NEXT_PUBLIC_API_BASE_URL;

type Category = {
  name: string;
  categoryTypeId: string;
};
type CategoryType = {
  id: string;
  name: string;
};
type CategoryField = keyof Category;

const CategoryForm = () => {
  const [categoryList, setCategoryList] = useState([
    { name: "", categoryTypeId: "" },
  ]);
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: "", categoryTypeId: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategoryTypes();
    fetchCategories();
  }, []);

  const fetchCategoryTypes = async () => {
    try {
      const res = await fetch(`${base_api}/api/category-types/`);
      const data = await res.json();
      if (res.ok) {
        setCategoryTypes(data.data);
      } else {
        notifyError("Failed to load category types.");
      }
    } catch (err) {
      console.error("Failed to fetch category types:", err);
      notifyError("An error occurred while fetching category types.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${base_api}/api/categories/`);
      const data = await res.json();
      if (res.ok) {
        setAllCategories(data.data);
      } else {
        notifyError("Failed to load categories.");
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      notifyError("An error occurred while fetching categories.");
    }
  };

  const handleInputChange = (
    index: number,
    field: CategoryField,
    value: string
  ) => {
    const updated = [...categoryList];
    updated[index][field] = value;
    setCategoryList(updated);
  };

  const handleAddCategoryInput = () => {
    setCategoryList([...categoryList, { name: "", categoryTypeId: "" }]);
  };

  const handleDeleteCategoryInput = (index: number) => {
    if (categoryList.length > 1) {
      setCategoryList(categoryList.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validCategories = categoryList.filter(
      (c) => c.name.trim() && c.categoryTypeId.trim()
    );

    if (validCategories.length === 0) {
      notifyError("Please fill in all fields before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${base_api}/api/categories/add-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: validCategories }),
      });
      setSubmitting(false);

      const result = await res.json();
      if (res.ok) {
        setCategoryList([{ name: "", categoryTypeId: "" }]);
        fetchCategories();
        notifySuccess("Categories added successfully!");
      } else {
        notifyError(result.message || "Failed to add categories.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      notifyError("An error occurred while submitting categories.");
      setSubmitting(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setEditData({
      name: category.name,
      categoryTypeId: category.categoryTypeId,
    });
  };

  const handleUpdate = async (id: number) => {
    if (!editData.name.trim() || !editData.categoryTypeId.trim()) {
      notifyError("Both fields are required.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${base_api}/api/categories/edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setSubmitting(false);

      const data = await res.json();
      if (res.ok) {
        setEditingId(null);
        fetchCategories();
        notifySuccess("Category updated successfully!");
      } else {
        notifyError(data.message || "Failed to update category.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      notifyError("An error occurred while updating the category.");
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setSubmitting(true);

      const res = await fetch(`${base_api}/api/categories/delete/${id}`, {
        method: "DELETE",
      });
      setSubmitting(false);

      const data = await res.json();
      if (res.ok) {
        fetchCategories();
        notifySuccess("Category deleted successfully!");
      } else {
        notifyError(data.message || "Failed to delete category.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      notifyError("An error occurred while deleting the category.");
      setSubmitting(false);
    }
  };
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left: Category Form */}
      <div className="col-span-12 lg:col-span-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 bg-white px-8 py-8 rounded-md">
            <label className="block text-base font-medium text-black mb-2">
              Add Categories
            </label>
            {categoryList.map((cat, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  className="input input-bordered w-full mb-2"
                  placeholder="Category name"
                  value={cat.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
                <ReactSelect
                  className="mb-2 w-full"
                  value={
                    categoryTypes.find(
                      (type: any) => type.id === cat.categoryTypeId
                    ) && {
                      value: cat.categoryTypeId,
                      label: categoryTypes.find(
                        (type: any) => type.id === cat.categoryTypeId
                      )?.name,
                    }
                  }
                  onChange={(selectedOption) =>
                    handleInputChange(
                      index,
                      "categoryTypeId",
                      selectedOption?.value || ""
                    )
                  }
                  options={categoryTypes.map((type: any) => ({
                    value: type.id,
                    label: type.name,
                  }))}
                />
                {/* <select
                  className="select select-bordered w-full mb-2"
                  value={cat.categoryTypeId}
                  onChange={(e) =>
                    handleInputChange(index, "categoryTypeId", e.target.value)
                  }
                >
                  <option value="">Select category type</option>
                  {categoryTypes.map((type: any) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select> */}
                <div className="flex justify-between">
                  {index === categoryList.length - 1 ? (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={handleAddCategoryInput}
                    >
                      + Add Another
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleDeleteCategoryInput(index)}
                    >
                      × Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              className="tp-btn px-7 py-2 mt-4"
              type="submit"
              disabled={submitting}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Right: Category List */}
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white px-8 py-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4">All Categories</h3>
          {allCategories.length === 0 ? (
            <p className="text-gray-500">No categories available.</p>
          ) : (
            <table className="table table-bordered table-striped mt-3 w-full">
              {" "}
              <thead className="thead-dark">
                {" "}
                <tr>
                  {" "}
                  <th scope="col" style={{ width: "50%", textAlign: "start" }}>
                    Name
                  </th>{" "}
                  <th scope="col" style={{ width: "25%", textAlign: "start" }}>
                    Type
                  </th>{" "}
                  <th scope="col" style={{ width: "25%", textAlign: "start" }}>
                    Actions
                  </th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                {allCategories.map((cat: any) => (
                  <tr key={cat.id}>
                    {" "}
                    {editingId === cat.id ? (
                      <>
                        {" "}
                        <td>
                          {" "}
                          <div className="col-12 col-md-6 px-0">
                            {" "}
                            <input
                              type="text"
                              className="form-control"
                              value={editData.name}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  name: e.target.value,
                                })
                              }
                            />{" "}
                          </div>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <div className="col-12 col-md-6 px-0">
                            {" "}
                            <ReactSelect
                              className="mb-2"
                              value={
                                categoryTypes.find(
                                  (type: any) =>
                                    type.id === editData.categoryTypeId
                                )
                                  ? {
                                      value: editData.categoryTypeId,
                                      label: categoryTypes.find(
                                        (type: any) =>
                                          type.id === editData.categoryTypeId
                                      )?.name,
                                    }
                                  : null
                              }
                              onChange={(selectedOption) =>
                                setEditData({
                                  ...editData,
                                  categoryTypeId: selectedOption?.value || "",
                                })
                              }
                              options={categoryTypes.map((type: any) => ({
                                value: type.id,
                                label: type.name,
                              }))}
                            />
                            {/* <select
                              className="form-control"
                              value={editData.categoryTypeId}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  categoryTypeId: e.target.value,
                                })
                              }
                            >
                              {" "}
                              <option value="">Select type</option>{" "}
                              {categoryTypes.map((type: any) => (
                                <option key={type.id} value={type.id}>
                                  {" "}
                                  {type.name}{" "}
                                </option>
                              ))}{" "}
                            </select>{" "} */}
                          </div>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <div className="col-12 col-md-6 px-0 d-flex gap-2">
                            {" "}
                            <button
                              className="btn btn-success btn-sm mr-2"
                              onClick={() => handleUpdate(cat.id)}
                              disabled={submitting}
                            >
                              {" "}
                              Save{" "}
                            </button>{" "}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditingId(null)}
                            >
                              {" "}
                              Cancel{" "}
                            </button>{" "}
                          </div>{" "}
                        </td>{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <td>
                          {" "}
                          <div className="col-12 col-md-6 px-0">
                            {cat.name}
                          </div>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <div className="col-12 col-md-3 px-0">
                            {" "}
                            {cat.categoryType?.name || "-"}{" "}
                          </div>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <div className="col-12 col-md-3 px-0 d-flex gap-2">
                            {" "}
                            <button
                              className="btn btn-outline-primary btn-sm mr-2"
                              onClick={() => handleEdit(cat)}
                            >
                              {" "}
                              Edit{" "}
                            </button>{" "}
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(cat.id)}
                              disabled={submitting}
                            >
                              {" "}
                              Delete{" "}
                            </button>{" "}
                          </div>{" "}
                        </td>{" "}
                      </>
                    )}{" "}
                  </tr>
                ))}{" "}
              </tbody>{" "}
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
