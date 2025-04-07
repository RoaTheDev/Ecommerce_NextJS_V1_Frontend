// // src/components/product/ProductFilters.tsx
// import React, {useEffect, useState} from 'react';
// import {useRouter, useSearchParams} from 'next/navigation';
// import {Input} from "@/components/ui/input";
// import {Slider} from "@/components/ui/slider";
// import {Button} from "@/components/ui/button";
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
// import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
// import {Badge} from "@/components/ui/badge";
// import {Filter, Search, SlidersHorizontal, X} from "lucide-react";
// // import {useCategories} from '@/lib/queries/useCategoryQueries';
// // import {useTags} from '@/lib/queries/useTagQueries';
// import {ProductFilterRequest, SortByEnum} from '@/lib/types/productTypes';
//
// interface ProductFiltersProps {
//     initialFilters: ProductFilterRequest;
//     onFilterChange: (filters: ProductFilterRequest) => void;
//     onReset: () => void;
//     appliedFilters: ProductFilterRequest;
//     priceRange: { min: number; max: number };
// }
//
// export function ProductFilters({
//                                    initialFilters,
//                                    onFilterChange,
//                                    onReset,
//                                    appliedFilters,
//                                    priceRange
//                                }: ProductFiltersProps) {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const {data: categories, isLoading: categoriesLoading} = useCategories();
//     const {data: tags, isLoading: tagsLoading} = useTags();
//
//     const [filters, setFilters] = useState<ProductFilterRequest>(initialFilters);
//     const [priceValues, setPriceValues] = useState<[number, number]>([
//         filters.minPrice || priceRange.min,
//         filters.maxPrice || priceRange.max
//     ]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState(filters.searchQuery || '');
//
//     // Update filters when URL parameters change
//     useEffect(() => {
//         const categoryId = searchParams.get('categoryId');
//         const minPrice = searchParams.get('minPrice');
//         const maxPrice = searchParams.get('maxPrice');
//         const inStock = searchParams.get('inStock');
//         const sortBy = searchParams.get('sortBy');
//         const search = searchParams.get('search');
//         const tagIds = searchParams.getAll('tagIds');
//
//         const newFilters: ProductFilterRequest = {...initialFilters};
//
//         if (categoryId) newFilters.categoryId = parseInt(categoryId);
//         if (minPrice) newFilters.minPrice = parseFloat(minPrice);
//         if (maxPrice) newFilters.maxPrice = parseFloat(maxPrice);
//         if (inStock) newFilters.inStock = inStock === 'true';
//         if (sortBy) newFilters.sortBy = sortBy as SortByEnum;
//         if (search) newFilters.searchQuery = search;
//         if (tagIds.length > 0) newFilters.tagIds = tagIds.map(id => parseInt(id));
//
//         setFilters(newFilters);
//         setPriceValues([
//             newFilters.minPrice || priceRange.min,
//             newFilters.maxPrice || priceRange.max
//         ]);
//         setSearchTerm(newFilters.searchQuery || '');
//     }, [searchParams, initialFilters, priceRange]);
//
//     const handleSearchSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         updateFilters({searchQuery: searchTerm});
//     };
//
//     const handleCategoryChange = (value: string) => {
//         updateFilters({categoryId: value === "all" ? undefined : parseInt(value)});
//     };
//
//     const handleSortChange = (value: string) => {
//         updateFilters({sortBy: value as SortByEnum});
//     };
//
//     const handleTagToggle = (tagId: number) => {
//         const currentTagIds = filters.tagIds || [];
//         const updatedTagIds = currentTagIds.includes(tagId)
//             ? currentTagIds.filter(id => id !== tagId)
//             : [...currentTagIds, tagId];
//
//         updateFilters({tagIds: updatedTagIds.length > 0 ? updatedTagIds : undefined});
//     };
//
//     const handlePriceChange = (value: number[]) => {
//         setPriceValues([value[0], value[1]]);
//     };
//
//     const applyPriceFilter = () => {
//         updateFilters({
//             minPrice: priceValues[0],
//             maxPrice: priceValues[1]
//         });
//     };
//
//     const handleInStockChange = (value: string) => {
//         updateFilters({inStock: value === "all" ? undefined : value === "true"});
//     };
//
//     const removeFilter = (filterKey: keyof ProductFilterRequest) => {
//         const newFilters = {...filters};
//         if (filterKey === 'tagIds') {
//             newFilters.tagIds = undefined;
//         } else {
//             newFilters[filterKey] = undefined;
//         }
//         onFilterChange(newFilters);
//     };
//
//     const updateFilters = (newValues: Partial<ProductFilterRequest>) => {
//         const updatedFilters = {...filters, ...newValues};
//         setFilters(updatedFilters);
//         onFilterChange(updatedFilters);
//     };
//
//     const getTagName = (tagId: number) => {
//         return tags?.find(t => t.tagId === tagId)?.tagName || `Tag ${tagId}`;
//     };
//
//     const getCategoryName = (categoryId?: number) => {
//         if (!categoryId) return 'All Categories';
//         return categories?.find(c => c.categoryId === categoryId)?.categoryName || `Category ${categoryId}`;
//     };
//
//     const getSortByName = (sortBy?: SortByEnum) => {
//         switch (sortBy) {
//             case SortByEnum.bestSelling:
//                 return 'Best Selling';
//             case SortByEnum.latest:
//                 return 'New Arrivals';
//             case SortByEnum.minPrice:
//                 return 'Price: Low to High';
//             case SortByEnum.maxPrice:
//                 return 'Price: High to Low';
//             case SortByEnum.name:
//                 return 'Name: A to Z';
//             default:
//                 return 'Featured';
//         }
//     };
//
//     const hasActiveFilters = () => {
//         return !!(
//             filters.categoryId ||
//             filters.searchQuery ||
//             filters.minPrice ||
//             filters.maxPrice ||
//             filters.inStock !== undefined ||
//             (filters.tagIds && filters.tagIds.length > 0) ||
//             filters.sortBy
//         );
//     };
//
//     // Mobile filter drawer
//     const toggleMobileFilters = () => {
//         setIsOpen(!isOpen);
//     };
//
//     return (
//         <>
//             {/* Applied Filters Tags - Visible on all devices */}
//             {hasActiveFilters() && (
//                 <div className="flex flex-wrap gap-2 mt-4 mb-6">
//                     {filters.searchQuery && (
//                         <Badge
//                             className="py-1.5 px-3 bg-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light))] rounded-full flex items-center gap-1.5">
//                             Search: {filters.searchQuery}
//                             <X
//                                 size={14}
//                                 className="ml-1 cursor-pointer"
//                                 onClick={() => removeFilter('searchQuery')}
//                             />
//                         </Badge>
//                     )}
//
//                     {filters.categoryId && (
//                         <Badge
//                             className="py-1.5 px-3 bg-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light))] rounded-full flex items-center gap-1.5">
//                             Category: {getCategoryName(filters.categoryId)}
//                             <X
//                                 size={14}
//                                 className="ml-1 cursor-pointer"
//                                 onClick={() => removeFilter('categoryId')}
//                             />
//                         </Badge>
//                     )}
//
//                     {(filters.minPrice || filters.maxPrice) && (
//                         <Badge
//                             className="py-1.5 px-3 bg-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light))] rounded-full flex items-center gap-1.5">
//                             Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
//                             <X
//                                 size={14}
//                                 className="ml-1 cursor-pointer"
//                                 onClick={() => {
//                                     removeFilter('minPrice');
//                                     removeFilter('maxPrice');
//                                 }}
//                             />
//                         </Badge>
//                     )}
//
//                     {filters.inStock !== undefined && (
//                         <Badge
//                             className="py-1.5 px-3 bg-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light))] rounded-full flex items-center gap-1.5">
//                             {filters.inStock ? 'In Stock Only' : 'Include Out of Stock'}
//                             <X
//                                 size={14}
//                                 className="ml-1 cursor-pointer"
//                                 onClick={() => removeFilter('inStock')}
//                             />
//                         </Badge>
//                     )}
//
//                     {filters.sortBy && (
//                         <Badge
//                             className="py-1.5 px-3 bg-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light))] rounded-full flex items-center gap-1.5">
//                             Sort: {getSortByName(filters.sortBy)}
//                             <X
//                                 size={14}
//                                 className="ml-1 cursor-pointer"
//                                 onClick={() => removeFilter('sortBy')}
//                             />
//                         </Badge>
//                     )}
//
//                     {filters.tagIds && filters.tagIds.map((tagId) => (
//                         <Badge
//                             key={tagId}
//                             className="py-1.5 px-3 bg-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light))] rounded-full flex items-center gap-1.5"
//                         >
//                             {getTagName(tagId)}
//                             <X
//                                 size={14}
//                                 className="ml-1 cursor-pointer"
//                                 onClick={() => handleTagToggle(tagId)}
//                             />
//                         </Badge>
//                     ))}
//
//                     <Button
//                         variant="ghost"
//                         className="text-[hsl(var(--fauna-secondary))] hover:text-[hsl(var(--fauna-deep))] hover:bg-transparent p-0 h-auto"
//                         onClick={onReset}
//                     >
//                         Clear All
//                     </Button>
//                 </div>
//             )}
//
//             {/* Search Bar and Sort - Desktop */}
//             <div className="hidden md:flex justify-between items-center mb-6">
//                 <div className="w-1/3">
//                     <form onSubmit={handleSearchSubmit} className="relative">
//                         <Input
//                             type="text"
//                             placeholder="Search products..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="pl-9 bg-white border-[hsl(var(--fauna-light))] focus-visible:ring-[hsl(var(--fauna-primary))]"
//                         />
//                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[hsl(var(--fauna-secondary))]"/>
//                         <Button
//                             type="submit"
//                             className="absolute right-0 top-0 h-full rounded-l-none bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))]"
//                         >
//                             Search
//                         </Button>
//                     </form>
//                 </div>
//
//                 <div className="flex items-center gap-4">
//                     <Select
//                         value={filters.sortBy?.toString() || ""}
//                         onValueChange={handleSortChange}
//                     >
//                         <SelectTrigger className="w-44 bg-white border-[hsl(var(--fauna-light))]">
//                             <SelectValue placeholder="Sort by"/>
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="">Featured</SelectItem>
//                             <SelectItem value={SortByEnum.BestSelling}>Best Selling</SelectItem>
//                             <SelectItem value={SortByEnum.Latest}>New Arrivals</SelectItem>
//                             <SelectItem value={SortByEnum.MinPrice}>Price: Low to High</SelectItem>
//                             <SelectItem value={SortByEnum.MaxPrice}>Price: High to Low</SelectItem>
//                             <SelectItem value={SortByEnum.Name}>Name: A to Z</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>
//             </div>
//
//             {/* Mobile Search, Sort and Filter Toggle */}
//             <div className="md:hidden mb-6">
//                 <form onSubmit={handleSearchSubmit} className="relative mb-4">
//                     <Input
//                         type="text"
//                         placeholder="Search products..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="pl-9 bg-white border-[hsl(var(--fauna-light))] focus-visible:ring-[hsl(var(--fauna-primary))]"
//                     />
//                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[hsl(var(--fauna-secondary))]"/>
//                     <Button
//                         type="submit"
//                         className="absolute right-0 top-0 h-full rounded-l-none bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))]"
//                     >
//                         Search
//                     </Button>
//                 </form>
//
//                 <div className="flex gap-2">
//                     <Button
//                         variant="outline"
//                         className="flex-1 border-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-secondary))]"
//                         onClick={toggleMobileFilters}
//                     >
//                         <Filter className="mr-2 h-4 w-4"/>
//                         Filter
//                     </Button>
//
//                     <Select
//                         value={filters.sortBy?.toString() || ""}
//                         onValueChange={handleSortChange}
//                     >
//                         <SelectTrigger className="flex-1 bg-white border-[hsl(var(--fauna-light))]">
//                             <SlidersHorizontal className="mr-2 h-4 w-4"/>
//                             <span className="truncate">Sort</span>
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="">Featured</SelectItem>
//                             <SelectItem value={SortByEnum.BestSelling}>Best Selling</SelectItem>
//                             <SelectItem value={SortByEnum.Latest}>New Arrivals</SelectItem>
//                             <SelectItem value={SortByEnum.MinPrice}>Price: Low to High</SelectItem>
//                             <SelectItem value={SortByEnum.MaxPrice}>Price: High to Low</SelectItem>
//                             <SelectItem value={SortByEnum.Name}>Name: A to Z</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>
//             </div>
//
//             {/* Filter Panel - Desktop */}
//             <div className="hidden md:flex">
//                 <div className="w-1/4 pr-6">
//                     <div className="bg-white rounded-lg p-4 shadow-sm border border-[hsl(var(--fauna-light)/20%)]">
//                         <h3 className="font-semibold text-xl mb-4 text-[hsl(var(--fauna-deep))]">Filters</h3>
//
//                         <Accordion type="single" collapsible className="w-full">
//                             <AccordionItem value="categories" className="border-b border-[hsl(var(--fauna-light)/30%)]">
//                                 <AccordionTrigger
//                                     className="text-[hsl(var(--fauna-secondary))] hover:text-[hsl(var(--fauna-deep))] hover:no-underline py-3">
//                                     Categories
//                                 </AccordionTrigger>
//                                 <AccordionContent>
//                                     <div className="flex flex-col gap-2">
//                                         <div
//                                             className={`cursor-pointer px-2 py-1 rounded hover:bg-[hsl(var(--fauna-light)/20%)] ${!filters.categoryId ? 'bg-[hsl(var(--fauna-light)/20%)] font-medium text-[hsl(var(--fauna-deep))]' : ''}`}
//                                             onClick={() => handleCategoryChange("all")}
//                                         >
//                                             All Categories
//                                         </div>
//                                         {!categoriesLoading && categories?.map((category) => (
//                                             <div
//                                                 key={category.categoryId}
//                                                 className={`cursor-pointer px-2 py-1 rounded hover:bg-[hsl(var(--fauna-light)/20%)] ${filters.categoryId === category.categoryId ? 'bg-[hsl(var(--fauna-light)/20%)] font-medium text-[hsl(var(--fauna-deep))]' : ''}`}
//                                                 onClick={() => handleCategoryChange(category.categoryId.toString())}
//                                             >
//                                                 {category.categoryName}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </AccordionContent>
//                             </AccordionItem>
//
//                             <AccordionItem value="price" className="border-b border-[hsl(var(--fauna-light)/30%)]">
//                                 <AccordionTrigger
//                                     className="text-[hsl(var(--fauna-secondary))] hover:text-[hsl(var(--fauna-deep))] hover:no-underline py-3">
//                                     Price Range
//                                 </AccordionTrigger>
//                                 <AccordionContent>
//                                     <div className="px-2">
//                                         <div className="mb-6">
//                                             <Slider
//                                                 defaultValue={[priceRange.min, priceRange.max]}
//                                                 min={priceRange.min}
//                                                 max={priceRange.max}
//                                                 step={1}
//                                                 value={priceValues}
//                                                 onValueChange={handlePriceChange}
//                                                 className="pt-6"
//                                             />
//                                         </div>
//                                         <div className="flex justify-between mb-4 text-sm">
//                                             <span>${priceValues[0]}</span>
//                                             <span>${priceValues[1]}</span>
//                                         </div>
//                                         <Button
//                                             onClick={applyPriceFilter}
//                                             className="w-full bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))]"
//                                         >
//                                             Apply
//                                         </Button>
//                                     </div>
//                                 </AccordionContent>
//                             </AccordionItem>
//
//                             <AccordionItem value="availability"
//                                            className="border-b border-[hsl(var(--fauna-light)/30%)]">
//                                 <AccordionTrigger
//                                     className="text-[hsl(var(--fauna-secondary))] hover:text-[hsl(var(--fauna-deep))] hover:no-underline py-3">
//                                     Availability
//                                 </AccordionTrigger>
//                                 <AccordionContent>
//                                     <div className="flex flex-col gap-2">
//                                         <div
//                                             className={`cursor-pointer px-2 py-1 rounded hover:bg-[hsl(var(--fauna-light)/20%)] ${filters.inStock === undefined ? 'bg-[hsl(var(--fauna-light)/20%)] font-medium text-[hsl(var(--fauna-deep))]' : ''}`}
//                                             onClick={() => handleInStockChange("all")}
//                                         >
//                                             All Products
//                                         </div>
//                                         <div
//                                             className={`cursor-pointer px-2 py-1 rounded hover:bg-[hsl(var(--fauna-light)/20%)] ${filters.inStock === true ? 'bg-[hsl(var(--fauna-light)/20%)] font-medium text-[hsl(var(--fauna-deep))]' : ''}`}
//                                             onClick={() => handleInStockChange("true")}
//                                         >
//                                             In Stock Only
//                                         </div>
//                                     </div>
//                                 </AccordionContent>
//                             </AccordionItem>
//
//                             <AccordionItem value="tags" className="border-b-0">
//                                 <AccordionTrigger
//                                     className="text-[hsl(var(--fauna-secondary))] hover:text-[hsl(var(--fauna-deep))] hover:no-underline py-3">
//                                     Tags
//                                 </AccordionTrigger>
//                                 <AccordionContent>
//                                     <div className="flex flex-wrap gap-2">
//                                         {!tagsLoading && tags?.map((tag) => (
//                                             <Badge
//                                                 key={tag.tagId}
//                                                 variant="outline"
//                                                 className={`cursor-pointer border px-2 py-1 ${
//                                                     filters.tagIds?.includes(tag.tagId)
//                                                         ? 'bg-[hsl(var(--fauna-light))] border-[hsl(var(--fauna-primary))] text-[hsl(var(--fauna-deep))]'
//                                                         : 'bg-white hover:bg-[hsl(var(--fauna-light)/20%)] border-[hsl(var(--fauna-light))]'
//                                                 }`}
//                                                 onClick={() => handleTagToggle(tag.tagId)}
//                                             >
//                                                 {tag.tagName}
//                                             </Badge>
//                                         ))}
//                                     </div>
//                                 </AccordionContent>
//                             </AccordionItem>
//                         </Accordion>
//
//                         {hasActiveFilters() && (
//                             <Button
//                                 variant="outline"
//                                 onClick={onReset}
//                                 className="w-full mt-4 border-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-secondary))] hover:text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light)/20%)]"
//                             >
//                                 Clear All Filters
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//
//             {/* Mobile Filter Panel (Drawer) */}
//             <div
//                 className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
//                 <div
//                     className={`absolute right-0 top-0 h-full w-4/5 max-w-md bg-white transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
//                     <div className="p-4 border-b border-[hsl(var(--fauna-light)/30%)]">
//                         <div className="flex justify-between items-center">
//                             <h3 className="font-semibold text-xl text-[hsl(var(--fauna-deep))]">Filters</h3>
//                             <Button variant="ghost" size="sm" onClick={toggleMobileFilters}>
//                                 <X size={20}/>
//                             </Button>
//                         </div>
//                     </div>
//
//                     <div className="p-4">
//                         <Accordion type="single" collapsible className="w-full">
//                             <AccordionItem value="categories" className="border-b border-[hsl(var(--fauna-light)/30%)]">
//                                 <AccordionTrigger
//                                     className="text-[hsl(var(--fauna-secondary))] hover:text-[hsl(var(--fauna-deep))] hover:no-underline py-3">
//                                     Categories
//                                 </AccordionTrigger>
//                                 <AccordionContent>
//                                     <div className="flex flex-col gap-2">
//                                         <div
//                                             className={`cursor-pointer px-2 py-1 rounded hover:bg-[hsl(var(--fauna-light)/20%)] ${!filters.categoryId ? 'bg-[hsl(var(--fauna-light)/20%)] font-medium text-[hsl(var(--fauna-deep))]' : ''}`}
//                                             onClick={() => handleCategoryChange("all")}
//                                         >
//                                             All Categories
//                                         </div>
//                                         {!categoriesLoading && categories?.map((category) => (
//                                             <div
//                                                 key={category.categoryId}
//                                                 className={`cursor-pointer px-2 py-1 rounded hover:bg-[hsl(var(--fauna-light)/20%)] ${filters.categoryId === category.categoryId ? 'bg-[hsl(var(--fauna-light)/20%)] font-medium text-[hsl(var(--fauna-deep))]' : ''}`}
//                                                 onClick={() => handleCategoryChange(category.categoryId.toString())}
//                                             >
//                                                 {category.categoryName}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </AccordionContent>
//                             </AccordionItem>
//
//                             <AccordionItem value="price" className="border-b border-[hsl(var(--fauna-light)/30%)]">
//                                 <AccordionTrigger
//                                     className="text-[hsl(var(--fauna-secondary))] hover:text-[hsl(var(--fauna-deep))] hover:no-underline py-3">
//                                     Price Range
//                                 </AccordionTrigger>
//                                 <AccordionContent>
//                                     <div className="px-2">
//                                         <div className="mb-6">
//                                             <Slider
//                                                 defaultValue={[priceRange.min, priceRange.max]}
//                                                 min={priceRange.min}
//                                                 max={priceRange.max}
//                                                 step={1}
//                                                 value={priceValues}
//                                                 onValueChange={handlePriceChange}
//                                                 className="pt-6"
//                                             />
//                                         </div>
//                                         <div className="flex justify-between mb-4 text-sm">
//                                             <span>${priceValues[0]}</span>
//                                             <span>${priceValues[1]}</span>
//                                         </div>
//                                         <Button
//                                             onClick={() => {
//                                                 applyPriceFilter();
//                                                 toggleMobileFilters();
//                                             }}
//                                             className="w-full bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))]"
//                                         >
//                                             Apply
//                                         </Button>
//                                     </div>
//                                 </AccordionContent>
//                             </AccordionItem>
//
//                             <AccordionItem value="availability"
//                                            className="border-b border-[hsl(var(--fauna-light)/30%)]">
//                                 <AccordionTrigger
//                                     className="text-[hsl(var(--fauna-secondary))] hover:text-[hsl(var(--fauna-deep))] hover:no-underline py-3">
//                                     Availability
//                                 </AccordionTrigger>
//                                 <AccordionContent>
//                                     <div className="flex flex-col gap-2">
//                                         <div
//                                             className={`cursor-pointer px-2 py-1 rounded hover:bg-[hsl(var(--fauna-light)/20%)] ${filters.inStock === undefined ? 'bg-[hsl(var(--fauna-light)/20%)] font-medium text-[hsl(var(--fauna-deep))]' : ''}`}
//                                             onClick={() => handleInStockChange("all")}
//                                         >
//                                             All Products
//                                         </div>
//                                         <div
//                                             className={`cursor-pointer px-2 py-1 rounded hover:bg-[hsl(var(--fauna-light)/20%)] ${filters.inStock === true ? 'bg-[hsl(var(--fauna-light)/20%)] font-medium text-[hsl(var(--fauna-deep))]' : ''}`}
//                                             onClick={() => handleInStockChange("true")}
//                                         >
//                                             In Stock Only
//                                         </div>
//                                     </div>
//                                 </AccordionContent>
//                             </AccordionItem>
//
//                             <AccordionItem value="tags" className="border-b-0">
//                                 <AccordionTrigger
//                                     className="text-[hsl(var(--fauna-secondary))] hover:text-[hsl(var(--fauna-deep))] hover:no-underline py-3">
//                                     Tags
//                                 </AccordionTrigger>
//                                 <AccordionContent>
//                                     <div className="flex flex-wrap gap-2">
//                                         {!tagsLoading && tags?.map((tag) => (
//                                             <Badge
//                                                 key={tag.tagId}
//                                                 variant="outline"
//                                                 className={`cursor-pointer border px-2 py-1 ${
//                                                     filters.tagIds?.includes(tag.tagId)
//                                                         ? 'bg-[hsl(var(--fauna-light))] border-[hsl(var(--fauna-primary))] text-[hsl(var(--fauna-deep))]'
//                                                         : 'bg-white hover:bg-[hsl(var(--fauna-light)/20%)] border-[hsl(var(--fauna-light))]'
//                                                 }`}
//                                                 onClick={() => handleTagToggle(tag.tagId)}
//                                             >
//                                                 {tag.tagName}
//                                             </Badge>
//                                         ))}
//                                     </div>
//                                 </AccordionContent>
//                             </AccordionItem>
//                         </Accordion>
//                     </div>
//
//                     <div className="p-4 border-t border-[hsl(var(--fauna-light)/30%)] sticky bottom-0 bg-white">
//                         <div className="flex gap-2">
//                             <Button
//                                 variant="outline"
//                                 onClick={() => {
//                                     onReset();
//                                     toggleMobileFilters();
//                                 }}
//                                 className="flex-1 border-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-secondary))] hover:bg-[hsl(var(--fauna-light)/20%)]"
//                             >
//                                 Clear All
//                             </Button>
//                             <Button
//                                 onClick={toggleMobileFilters}
//                                 className="flex-1 bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))]"
//                             >
//                                 Apply Filters
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }