"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import BookProductCard from "./ProductCard"
import { getProducts } from "@/api/User/productApi"

const AllProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    author: "",
    language: ""
  })
  const [sortOption, setSortOption] = useState("newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const productsPerPage = 6
  const navigate = useNavigate()

  // Categories and price ranges for filters
  const languages = ['English', 'Malayalam', 'Hindi', 'Tamil'];
  const priceRanges = [
    { label: "Under ₹200", value: "0-200" },
    { label: "₹200 - ₹500", value: "200-500" },
    { label: "₹500 - ₹1000", value: "500-1000" },
    { label: "Over ₹1000", value: "1000-200000" },
  ]
  const sortOptions = [
    { label: "Newest", value: "newest" }, 
    { label: "Oldest", value: "oldest" }, 
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Rating: High to Low", value: "rating_desc" },
  ];
  // Function to fetch all products
  const fetchAllProducts = async () => {
    setLoading(true)
    try {
      
      const response = await getProducts(
        currentPage,
        productsPerPage,
        searchQuery,
        filters.category,
        filters.priceRange,
        filters.author,
        sortOption,
        filters.language
      );
      setProducts(response.products)
      setTotalPages(response.totalPages)
      setCurrentPage(response.currentPage)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllProducts()
  }, [currentPage, searchQuery, filters, sortOption]) 

 
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle search button click
  const handleSearch = () => {
    setCurrentPage(1) 
  }

  const handleCancel = () => {
    setSearchQuery("") 
    setCurrentPage(1) 
  }

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
    setCurrentPage(1) 
  }

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value)
    setCurrentPage(1) 
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      author: "",
    })
    setSortOption("newest")
    setSearchQuery("")
    setCurrentPage(1)
  }

  // Toggle filter sidebar on mobile
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Shop All Books</h1>

      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex items-center">
          <button onClick={toggleFilter} className="md:hidden px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2">
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
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
        </div>

        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 w-full md:w-64 focus:outline-none"
          />
          <button onClick={handleSearch} className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors">
            Search
          </button>
          {searchQuery && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className={`md:w-1/4 ${isFilterOpen ? "block" : "hidden"} md:block`}>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-black">
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Languages</h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <label key={lang} className="flex items-center">
                    <input
                      type="radio"
                      name="language"
                      checked={filters.language === lang}
                      onChange={() => handleFilterChange("language", lang)}
                      className="mr-2"
                    />
                    {lang}
                  </label>
                ))}
                {filters.category && (
                  <button
                    onClick={() => handleFilterChange("category", "")}
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === range.value}
                      onChange={() => handleFilterChange("priceRange", range.value)}
                      className="mr-2"
                    />
                    {range.label}
                  </label>
                ))}
                {filters.priceRange && (
                  <button
                    onClick={() => handleFilterChange("priceRange", "")}
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Author</h3>
              <input
                type="text"
                placeholder="Search by author..."
                value={filters.author}
                onChange={(e) => handleFilterChange("author", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
              {filters.author && (
                <button
                  onClick={() => handleFilterChange("author", "")}
                  className="text-sm text-gray-500 hover:text-black mt-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Active Filters */}
          {(filters.category || filters.priceRange || filters.author) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.category && (
                <span className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                  Category: {filters.category}
                  <button
                    onClick={() => handleFilterChange("category", "")}
                    className="ml-2 text-gray-500 hover:text-black"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.priceRange && (
                <span className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                  Price: {priceRanges.find((r) => r.value === filters.priceRange)?.label}
                  <button
                    onClick={() => handleFilterChange("priceRange", "")}
                    className="ml-2 text-gray-500 hover:text-black"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.author && (
                <span className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                  Author: {filters.author}
                  <button
                    onClick={() => handleFilterChange("author", "")}
                    className="ml-2 text-gray-500 hover:text-black"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-2"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* No Results */}
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-xl text-gray-600 mb-4">No books found</p>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Product Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => navigate(`/product-detail/${product._id}`)}
                        className="cursor-pointer transition-transform hover:scale-105"
                      >
                        <BookProductCard
                          name={product.name}
                          rating={product.rating || 4.5}
                          price={product.regularPrice}
                          image={product.productImages[0]}
                          author={product.writer || "Unknown"}
                          availability={product.availableQuantity}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center mt-8">
                    {totalPages > 1 && (
                      <>
                        <button
                          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`mx-1 px-4 py-2 rounded-md ${currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                          Previous
                        </button>

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
                                className={`mx-1 px-4 py-2 rounded-md ${currentPage === i + 1 ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"
                                  }`}
                              >
                                {i + 1}
                              </button>
                            )
                          } else if (
                            (i === 1 && currentPage > 3) ||
                            (i === totalPages - 2 && currentPage < totalPages - 3)
                          ) {
                            return (
                              <span key={i} className="mx-1 px-2">
                                ...
                              </span>
                            )
                          }
                          return null
                        })}

                        <button
                          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`mx-1 px-4 py-2 rounded-md ${currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                          Next
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllProducts

