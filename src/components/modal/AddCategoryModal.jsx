import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Adjust path based on your Shadcn setup
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addCategory } from "@/api/Admin/categoryApi";
import { toast } from "react-toastify";

const AddCategoryModal = () => {
  const [open, setOpen] = useState(false); // State to control modal open/close
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = "Category name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      validationErrors.name = "Category name must contain only letters";
    }

    if (!formData.description.trim()) {
      validationErrors.description = "Description is required";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) return;

    try {
      const response = await addCategory(formData);
      toast.success(response.message);
      setFormData({ name: "", description: "" });
    } catch (error) {
      toast.error(error.response.data.message);
      setFormData({ name: "", description: "" });
      console.log(error)
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="text-lg py-3">
          Add New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Add Category
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Category Name</label>
            <Input
              name="name"
              placeholder="Enter category name"
              value={formData.name}
              onChange={handleChange}
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-2">Description</label>
            <Textarea
              name="description"
              placeholder="Enter category description"
              value={formData.description}
              onChange={handleChange}
              className="w-full"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          {errors.submit && (
            <p className="text-red-500 text-sm mt-1">{errors.submit}</p>
          )}
          <Button
            type="submit"
            className="w-full text-lg py-3"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
