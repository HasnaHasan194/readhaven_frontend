import React, { useState } from "react";
import CategoryTable from "./CategoryTable.jsx";
import AddCategoryModal from "@/components/modal/AddCategoryModal.jsx";

const AddCategory = () => {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-6 ml-56">
      <div className="w-full max-w-4xl mx-auto">
        
        <CategoryTable />
      </div>
    </div>
  );
};

export default AddCategory;
