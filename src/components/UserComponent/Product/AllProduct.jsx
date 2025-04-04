import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookProductCard from "./ProductCard";
import { getProducts } from "@/api/User/productApi";
import { useDebounce } from "use-debounce";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    author: "",
    languages: [],
  });
  const [sortOption, setSortOption] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const productsPerPage = 6;
  const navigate = useNavigate();

  const languages = ["English", "Malayalam", "Hindi", "Tamil"];
  const categories = ["Romance", "Humour", "Story", "Novel", "Fantasy"];
  const priceRanges = [
    { label: "Under ₹200", value: "0-200" },
    { label: "₹200 - ₹500", value: "200-500" },
    { label: "₹500 - ₹1000", value: "500-1000" },
    { label: "Over ₹1000", value: "1000-200000" },
  ];
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Rating: High to Low", value: "rating_desc" },
  ];
  // The debouncedSearch will update 500ms after searchQuery changes
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const fetchAllProducts = async (page, search, filterOptions, sort) => {
    setLoading(true);
    try {
      const response = await getProducts(
        page,
        productsPerPage,
        search, // Use the passed search parameter
        filterOptions.category,
        filterOptions.priceRange,
        filterOptions.author,
        sort,
        filterOptions.languages.join(",")
      );
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect that runs when debounced search value changes
  useEffect(() => {
    // Reset to page 1 when search changes
    fetchAllProducts(1, debouncedSearch, filters, sortOption);
    // Only include debouncedSearch in dependencies, not searchQuery
  }, [debouncedSearch, filters, sortOption]);

  // Separate effect for handling page changes
  // This prevents resetting to page 1 when just changing pages
  useEffect(() => {
    if (currentPage >= 1) {
      fetchAllProducts(currentPage, debouncedSearch, filters, sortOption);
    }
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
  };

  // This is no longer needed as the debounced value will trigger the effect
  const handleSearch = () => {
    // We can keep this if you want an immediate search on button click
    fetchAllProducts(1, searchQuery, filters, sortOption);
    setCurrentPage(1);
  };

  const handleCancel = () => {
    setSearchQuery("");
    setCurrentPage(1);
    // Explicitly fetch products with empty search
    fetchAllProducts(1, "", filters, sortOption);
  };

  const handleFilterChange = (filterType, value) => {
    let newFilters;
    
    if (filterType === "languages") {
      if (value === "") {
        // Clear all languages
        newFilters = {
          ...filters,
          languages: [],
        };
      } else {
        newFilters = {
          ...filters,
          languages: filters.languages.includes(value)
            ? filters.languages.filter((lang) => lang !== value)
            : [...filters.languages, value],
        };
      }
    } else {
      newFilters = {
        ...filters,
        [filterType]: value,
      };
    }
    
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Immediately fetch with new filters
    fetchAllProducts(1, debouncedSearch, newFilters, sortOption);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortOption(newSort);
    setCurrentPage(1);
    
    // Immediately fetch with new sort option
    fetchAllProducts(1, debouncedSearch, filters, newSort);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      priceRange: "",
      author: "",
      languages: [],
    };
    setFilters(clearedFilters);
    setSortOption("newest");
    setSearchQuery("");
    setCurrentPage(1);
    
    // Fetch with cleared filters
    fetchAllProducts(1, "", clearedFilters, "newest");
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-black relative inline-block">
            <span className="relative z-10">Discover Books</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-gray-300 opacity-60 z-0"></span>
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Explore our curated collection of books across various genres,
            languages, and authors
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div className="flex items-center">
            <button
              onClick={toggleFilter}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-700 to-black text-white rounded-lg shadow-lg hover:shadow-gray-400 transition-all duration-300 transform hover:-translate-y-1"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
            <div className="hidden md:block relative group">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="appearance-none pl-4 pr-10 py-2.5 border-2 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all group-hover:border-gray-600"
              >
                <option value="" disabled>
                  Sort By
                </option>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative flex-grow md:max-w-md">
            <div className="flex items-center border-2 border-gray-300 bg-white rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-gray-500 focus-within:border-gray-500 transition-all duration-300">
              <div className="pl-3 text-gray-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-3 py-2.5 w-full focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={handleCancel}
                  className="px-3 text-gray-500 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-black text-white hover:from-gray-800 hover:to-gray-900 transition-colors duration-300"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div
            className={`md:w-1/4 ${
              isFilterOpen ? "block" : "hidden"
            } md:block transition-all duration-300 ease-in-out`}
          >
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-black flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" /> Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-black flex items-center gap-1 transition-colors duration-300"
                >
                  <RefreshCw className="w-3 h-3" /> Clear All
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-600 mr-2"></span>
                  Category
                </h3>
                <div className=" Sketchyrelative">
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2.5 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-600 mr-2"></span>
                  Languages
                </h3>
                <div className="space-y-2.5">
                  {languages.map((lang) => (
                    <label
                      key={lang}
                      className="flex items-center cursor-pointer group rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={filters.languages.includes(lang)}
                        onChange={() => handleFilterChange("languages", lang)}
                        className="w-4 h-4 text-black focus:ring-gray-500 accent-black"
                      />
                      <span className="ml-2.5 text-gray-800 group-hover:text-black transition-colors">
                        {lang}
                      </span>
                    </label>
                  ))}
                  {filters.languages.length > 0 && (
                    <button
                      onClick={() => handleFilterChange("languages", "")}
                      className="text-sm text-gray-500 hover:text-black mt-1 flex items-center gap-1 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" /> Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-600 mr-2"></span>
                  Price Range
                </h3>
                <div className="space-y-2.5">
                  {priceRanges.map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center cursor-pointer group rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.priceRange === range.value}
                        onChange={() =>
                          handleFilterChange("priceRange", range.value)
                        }
                        className="w-4 h-4 text-black focus:ring-gray-500 accent-black"
                      />
                      <span className="ml-2.5 text-gray-800 group-hover:text-black transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                  {filters.priceRange && (
                    <button
                      onClick={() => handleFilterChange("priceRange", "")}
                      className="text-sm text-gray-500 hover:text-black mt-1 flex items-center gap-1 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-3 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-600 mr-2"></span>
                  Author
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by author..."
                    value={filters.author}
                    onChange={(e) =>
                      handleFilterChange("author", e.target.value)
                    }
                    className="w-full px-3 py-2.5 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                  />
                  {filters.author && (
                    <button
                      onClick={() => handleFilterChange("author", "")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-3/4">
            {(filters.category ||
              filters.priceRange ||
              filters.author ||
              filters.languages.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.category && (
                  <span className="bg-gradient-to-r from-gray-200 to-gray-300 px-3 py-1.5 rounded-full text-sm flex items-center text-gray-800 border border-gray-400 shadow-sm">
                    Category: {filters.category}
                    <button
                      onClick={() => handleFilterChange("category", "")}
                      className="ml-2 text-gray-600 hover:text-black transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.languages.length > 0 && (
                  <span className="bg-gradient-to-r from-gray-200 to-gray-300 px-3 py-1.5 rounded-full text-sm flex items-center text-gray-800 border border-gray-400 shadow-sm">
                    Languages: {filters.languages.join(", ")}
                    <button
                      onClick={() => handleFilterChange("languages", "")}
                      className="ml-2 text-gray-600 hover:text-black transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.priceRange && (
                  <span className="bg-gradient-to-r from-gray-200 to-gray-300 px-3 py-1.5 rounded-full text-sm flex items-center text-gray-800 border border-gray-400 shadow-sm">
                    Price:{" "}
                    {
                      priceRanges.find((r) => r.value === filters.priceRange)
                        ?.label
                    }
                    <button
                      onClick={() => handleFilterChange("priceRange", "")}
                      className="ml-2 text-gray-600 hover:text-black transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.author && (
                  <span className="bg-gradient-to-r from-gray-200 to-gray-300 px-3 py-1.5 rounded-full text-sm flex items-center text-gray-800 border border-gray-400 shadow-sm">
                    Author: {filters.author}
                    <button
                      onClick={() => handleFilterChange("author", "")}
                      className="ml-2 text-gray-600 hover:text-black transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
            )}

            <div className="md:hidden mb-6">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="appearance-none w-full pl-4 pr-10 py-2.5 border-2 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                >
                  <option value="" disabled>
                    Sort By
                  </option>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 w-72"
                  >
                    <div className="bg-gray-300 h-80 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="bg-gray-300 h-5 w-3/4 rounded mb-3"></div>
                      <div className="bg-gray-300 h-4 w-1/2 rounded mb-3"></div>
                      <div className="bg-gray-300 h-4 w-1/4 rounded mb-3"></div>
                      <div className="bg-gray-300 h-8 w-full rounded mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl p-8 shadow-md border border-gray-200 bg-gradient-to-br from-white to-gray-100">
                    <BookOpen className="w-16 h-16 text-gray-400 mb-4 animate-pulse" />
                    <p className="text-xl text-gray-800 mb-2 font-medium">
                      No books found
                    </p>
                    <p className="text-gray-700 text-center mb-6">
                      Try adjusting your search or filters to find what you're
                      looking for
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2.5 bg-gradient-to-r from-gray-700 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-gray-400 transform hover:-translate-y-1 flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Clear All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                      {products.map((product) => (
                        <div
                          key={product._id}
                          onClick={() =>
                            navigate(`/product-detail/${product._id}`)
                          }
                          className="cursor-pointer"
                        >
                          <BookProductCard
                            id={product._id}
                            name={product.name}
                            rating={product.rating || 4.5}
                            price={product.regularPrice}
                            salePrice={product.salePrice}
                            image={product.productImages[0]}
                            author={product.writer || "Unknown"}
                            availability={
                              product.availableQuantity > 0
                                ? "In Stock"
                                : "Out of Stock"
                            }
                            Category={product.Category.name}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-12">
                      {totalPages > 1 && (
                        <div className="inline-flex items-center rounded-lg shadow-md border border-gray-200 bg-white overflow-hidden">
                          <button
                            onClick={() =>
                              currentPage > 1 && paginate(currentPage - 1)
                            }
                            disabled={currentPage === 1}
                            className={`flex items-center gap-1 px-4 py-2 ${
                              currentPage === 1
                                ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-100 hover:text-black"
                            } transition-colors border-r border-gray-200`}
                          >
                            <ChevronLeft className="w-4 h-4" /> Prev
                          </button>

                          <div className="hidden sm:flex">
                            {Array.from({ length: totalPages }, (_, i) => {
                              if (
                                i === 0 ||
                                i === totalPages - 1 ||
                                (i >= currentPage - 2 && i <= currentPage) ||
                                (i <= currentPage + 2 && i >= currentPage)
                              ) {
                                return (
                                  <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-10 h-10 flex items-center justify-center border-r border-gray-200 ${
                                      currentPage === i + 1
                                        ? "bg-gradient-to-r from-gray-700 to-black text-white font-medium"
                                        : "bg-white text-gray-800 hover:bg-gray-100 hover:text-black"
                                    } transition-colors`}
                                  >
                                    {i + 1}
                                  </button>
                                );
                              } else if (
                                (i === 1 && currentPage > 3) ||
                                (i === totalPages - 2 &&
                                  currentPage < totalPages - 3)
                              ) {
                                return (
                                  <span
                                    key={i}
                                    className="w-10 h-10 flex items-center justify-center border-r border-gray-200 text-gray-400"
                                  >
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            })}
                          </div>

                          <div className="sm:hidden px-4 py-2 text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                          </div>

                          <button
                            onClick={() =>
                              currentPage < totalPages &&
                              paginate(currentPage + 1)
                            }
                            disabled={currentPage === totalPages}
                            className={`flex items-center gap-1 px-4 py-2 ${
                              currentPage === totalPages
                                ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-100 hover:text-black"
                            } transition-colors`}
                          >
                            Next <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;