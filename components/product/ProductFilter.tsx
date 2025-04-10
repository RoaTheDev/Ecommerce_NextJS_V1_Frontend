'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAllCategories } from '@/lib/queries/useCategoryQueries';
import { useAllTags } from '@/lib/queries/useTagQueries';
import { ProductFilterRequest, SortByEnum } from '@/lib/types/productTypes';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { AllTagResponse } from '@/lib/types/tagTypes';
import { PaginatedCategoryResponse } from '@/lib/types/categoryTypes';

export type AllTagsResponse = AllTagResponse[];

const filterFormSchema = z.object({
    searchQuery: z.string().optional(),
    categoryId: z.number().optional().nullable(),
    tagIds: z.array(z.number()).optional().nullable(),
    minPrice: z.number().min(0).optional().nullable(),
    maxPrice: z.number().min(0).optional().nullable(),
    inStock: z.boolean().optional().nullable(),
    sortBy: z.nativeEnum(SortByEnum).optional().nullable(),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

interface ProductFilterProps {
    onFilterChangeAction: (filter: ProductFilterRequest) => Promise<void>;
    initialFilter?: ProductFilterRequest;
}

export default function ProductFilter({ onFilterChangeAction, initialFilter }: ProductFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([
        initialFilter?.minPrice ?? 0,
        initialFilter?.maxPrice ?? 1000,
    ]);
    const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

    const { data: categoriesData } = useAllCategories({ cursor: 0, pageSize: 100 });
    const { data: tagsData } = useAllTags({ cursor: 0, pageSize: 100 });

    // Safely extract categories and tags with fallbacks
    const categories = categoriesData as PaginatedCategoryResponse | undefined;
    const tags = tagsData as AllTagsResponse | undefined;

    const form = useForm<FilterFormValues>({
        resolver: zodResolver(filterFormSchema),
        defaultValues: {
            searchQuery: initialFilter?.searchQuery || '',
            categoryId: initialFilter?.categoryId || null,
            tagIds: initialFilter?.tagIds || [],
            minPrice: initialFilter?.minPrice ?? 0,
            maxPrice: initialFilter?.maxPrice ?? 1000,
            inStock: initialFilter?.inStock ?? null,
            sortBy: initialFilter?.sortBy || SortByEnum.Latest,
        },
    });

    const watchMinPrice = form.watch('minPrice');
    const watchMaxPrice = form.watch('maxPrice');

    useEffect(() => {
        const minPrice = watchMinPrice ?? 0;
        const maxPrice = watchMaxPrice ?? 1000;
        setPriceRange([minPrice, maxPrice]);
    }, [watchMinPrice, watchMaxPrice]);

    const watchSearchQuery = form.watch('searchQuery');
    const watchCategoryId = form.watch('categoryId');
    const watchTagIds = form.watch('tagIds');
    const watchInStock = form.watch('inStock');
    const watchSortBy = form.watch('sortBy');

    useEffect(() => {
        const newAppliedFilters: string[] = [];

        if (watchSearchQuery) newAppliedFilters.push(`Search: ${watchSearchQuery}`);
        if (watchCategoryId && categories?.categories) {
            const category = categories.categories.find((c) => c.categoryId === watchCategoryId);
            if (category) newAppliedFilters.push(`Category: ${category.categoryName}`);
        }
        if (watchTagIds && tags) {
            (watchTagIds ?? []).forEach((tagId) => {
                const tag = tags.find((t) => t.tagId === tagId);
                if (tag) newAppliedFilters.push(`Tag: ${tag.tagName}`);
            });
        }
        const minPrice = watchMinPrice;
        const maxPrice = watchMaxPrice;
        if (minPrice || maxPrice) newAppliedFilters.push(`Price: $${minPrice ?? 0} - $${maxPrice ?? '∞'}`);
        if (watchInStock !== null) newAppliedFilters.push(`Stock: ${watchInStock ? 'In Stock' : 'All Items'}`);
        if (watchSortBy && watchSortBy !== SortByEnum.None) {
            const sortMap: Record<SortByEnum, string> = {
                [SortByEnum.Latest]: 'Newest First',
                [SortByEnum.MinPrice]: 'Price: Low to High',
                [SortByEnum.MaxPrice]: 'Price: High to Low',
                [SortByEnum.BestSelling]: 'Best Selling',
                [SortByEnum.Name]: 'Name (A-Z)',
                [SortByEnum.Date]: 'Date Added',
                [SortByEnum.None]: '',
            };
            newAppliedFilters.push(`Sort: ${sortMap[watchSortBy]}`);
        }

        setAppliedFilters(newAppliedFilters);
    }, [watchSearchQuery, watchCategoryId, watchTagIds, watchMinPrice, watchMaxPrice, watchInStock, watchSortBy, categories, tags]);

    const onSubmit = async (values: FilterFormValues) => {
        const filter: ProductFilterRequest = {
            searchQuery: values.searchQuery || undefined,
            categoryId: values.categoryId || undefined,
            tagIds: values.tagIds?.length ? values.tagIds : undefined,
            minPrice: values.minPrice ?? undefined,
            maxPrice: values.maxPrice ?? undefined,
            inStock: values.inStock ?? undefined,
            sortBy: values.sortBy || undefined,
        };
        await onFilterChangeAction(filter);
        setIsOpen(false);
    };

    const handleResetFilters = async () => {
        form.reset({
            searchQuery: '',
            categoryId: null,
            tagIds: [],
            minPrice: 0,
            maxPrice: 1000,
            inStock: null,
            sortBy: SortByEnum.Latest,
        });
        setPriceRange([0, 1000]);
        await onFilterChangeAction({ sortBy: SortByEnum.Latest });
    };

    const handleRemoveFilter = async (filter: string) => {
        if (filter.startsWith('Search:')) form.setValue('searchQuery', '');
        else if (filter.startsWith('Category:')) form.setValue('categoryId', null);
        else if (filter.startsWith('Tag:') && tags) {
            const tagName = filter.replace('Tag: ', '');
            const tag = tags.find((t) => t.tagName === tagName);
            if (tag) {
                const currentTags = form.getValues('tagIds') ?? [];
                form.setValue('tagIds', currentTags.filter((id) => id !== tag.tagId));
            }
        } else if (filter.startsWith('Price:')) {
            form.setValue('minPrice', 0);
            form.setValue('maxPrice', 1000);
            setPriceRange([0, 1000]);
        } else if (filter.startsWith('Stock:')) form.setValue('inStock', null);
        else if (filter.startsWith('Sort:')) form.setValue('sortBy', SortByEnum.Latest);
        await form.handleSubmit(onSubmit)();
    };

    return (
        <div>
            {/* Desktop filter panel */}
            <div className="hidden md:block mb-8 bg-[hsl(var(--fauna-background))]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[280px]">
                                <FormField
                                    control={form.control}
                                    name="searchQuery"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Search products..."
                                                        className="pl-10 h-10 border-[hsl(var(--fauna-light)/50%)] focus:border-[hsl(var(--fauna-primary))] bg-white"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <Search
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--fauna-secondary))]"
                                                    size={18}
                                                />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full sm:w-auto">
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select
                                                value={field.value?.toString() || ''}
                                                onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                                            >
                                                <SelectTrigger className="w-[200px] h-10 border-[hsl(var(--fauna-light)/50%)] focus:border-[hsl(var(--fauna-primary))] bg-white">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All categories</SelectItem>
                                                    {categories?.categories?.map((category) => (
                                                        <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                                                            {category.categoryName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full sm:w-auto">
                                <FormField
                                    control={form.control}
                                    name="sortBy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select
                                                value={field.value || ''}
                                                onValueChange={(value) => field.onChange(value as SortByEnum || null)}
                                            >
                                                <SelectTrigger className="w-[200px] h-10 border-[hsl(var(--fauna-light)/50%)] focus:border-[hsl(var(--fauna-primary))] bg-white">
                                                    <SelectValue placeholder="Sort by" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={SortByEnum.Latest}>Newest First</SelectItem>
                                                    <SelectItem value={SortByEnum.BestSelling}>Best Selling</SelectItem>
                                                    <SelectItem value={SortByEnum.MinPrice}>Price: Low to High</SelectItem>
                                                    <SelectItem value={SortByEnum.MaxPrice}>Price: High to Low</SelectItem>
                                                    <SelectItem value={SortByEnum.Name}>Name (A-Z)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-10 border-[hsl(var(--fauna-light)/50%)] bg-white text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light)/20%)] hover:text-[hsl(var(--fauna-deep))]"
                                    >
                                        <SlidersHorizontal size={18} className="mr-2" /> More Filters
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-4 p-2">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-[hsl(var(--fauna-deep))]">Price Range</h4>
                                            <div className="pt-4 px-2">
                                                <Slider
                                                    value={priceRange}
                                                    min={0}
                                                    max={1000}
                                                    step={10}
                                                    onValueChange={(values) => {
                                                        setPriceRange(values as [number, number]);
                                                        form.setValue('minPrice', values[0]);
                                                        form.setValue('maxPrice', values[1]);
                                                    }}
                                                    className="my-6"
                                                />
                                                <div className="flex justify-between mt-2">
                                                    <div className="border rounded p-2 w-[45%] text-center bg-white">${priceRange[0]}</div>
                                                    <div className="border rounded p-2 w-[45%] text-center bg-white">${priceRange[1]}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-[hsl(var(--fauna-deep))]">Tags</h4>
                                            <div className="max-h-40 overflow-y-auto pr-2">
                                                {Array.isArray(tags) && tags.length > 0 ? (
                                                    tags.map((tag) => (
                                                        <div key={tag.tagId} className="flex items-center space-x-2 py-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="tagIds"
                                                                render={({ field }) => (
                                                                    <FormItem className="flex flex-row items-center space-x-2">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={(field.value ?? []).includes(tag.tagId)}
                                                                                onCheckedChange={(checked) => {
                                                                                    const currentTags = field.value ?? [];
                                                                                    if (checked) {
                                                                                        field.onChange([...currentTags, tag.tagId]);
                                                                                    } else {
                                                                                        field.onChange(currentTags.filter((id) => id !== tag.tagId));
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="cursor-pointer text-[hsl(var(--fauna-secondary))]">{tag.tagName}</FormLabel>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-[hsl(var(--fauna-secondary))]">No tags available</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="inStock"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-2">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value === true}
                                                                onCheckedChange={(checked) => field.onChange(checked ? true : null)}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="cursor-pointer text-[hsl(var(--fauna-secondary))]">In Stock Only</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                form.setValue('minPrice', 0);
                                                form.setValue('maxPrice', 1000);
                                                form.setValue('tagIds', []);
                                                form.setValue('inStock', null);
                                                setPriceRange([0, 1000]);
                                            }}
                                            className="text-[hsl(var(--fauna-deep))]"
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            type="submit"
                                            onClick={() => form.handleSubmit(onSubmit)()}
                                            className="bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))] text-white"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button
                                type="submit"
                                className="bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))] text-white"
                            >
                                Search
                            </Button>
                            {appliedFilters.length > 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className="border-[hsl(var(--fauna-light)/50%)] text-[hsl(var(--fauna-secondary))] hover:bg-[hsl(var(--fauna-light)/20%)]"
                                >
                                    Reset All
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
                {appliedFilters.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {appliedFilters.map((filter, index) => (
                            <Badge
                                key={index}
                                className="bg-[hsl(var(--fauna-light)/30%)] text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light)/40%)] px-3 py-1.5"
                            >
                                {filter}
                                <X size={14} className="ml-1 cursor-pointer" onClick={() => handleRemoveFilter(filter)} />
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile filter panel */}
            <div className="md:hidden mb-6">
                <div className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="searchQuery"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            placeholder="Search products..."
                                            className="pl-10 h-10 border-[hsl(var(--fauna-light)/50%)] focus:border-[hsl(var(--fauna-primary))] bg-white"
                                            {...field}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') form.handleSubmit(onSubmit)();
                                            }}
                                        />
                                    </FormControl>
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--fauna-secondary))]"
                                        size={18}
                                    />
                                </div>
                            </FormItem>
                        )}
                    />
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                className="border-[hsl(var(--fauna-light)/50%)] bg-white text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light)/20%)]"
                            >
                                <SlidersHorizontal size={18} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[85vw] sm:max-w-md bg-[hsl(var(--fauna-background))]">
                            <SheetHeader>
                                <SheetTitle className="text-[hsl(var(--fauna-deep))] text-xl">Filters</SheetTitle>
                            </SheetHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="category" className="border-[hsl(var(--fauna-light)/50%)]">
                                            <AccordionTrigger className="text-[hsl(var(--fauna-deep))]">Categories</AccordionTrigger>
                                            <AccordionContent>
                                                <FormField
                                                    control={form.control}
                                                    name="categoryId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select
                                                                value={field.value?.toString() || ''}
                                                                onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                                                            >
                                                                <SelectTrigger className="w-full border-[hsl(var(--fauna-light)/50%)] focus:border-[hsl(var(--fauna-primary))] bg-white">
                                                                    <SelectValue placeholder="Select category" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="">All categories</SelectItem>
                                                                    {categories?.categories?.map((category) => (
                                                                        <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                                                                            {category.categoryName}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="sort" className="border-[hsl(var(--fauna-light)/50%)]">
                                            <AccordionTrigger className="text-[hsl(var(--fauna-deep))]">Sort By</AccordionTrigger>
                                            <AccordionContent>
                                                <FormField
                                                    control={form.control}
                                                    name="sortBy"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select
                                                                value={field.value || ''}
                                                                onValueChange={(value) => field.onChange(value as SortByEnum || null)}
                                                            >
                                                                <SelectTrigger className="w-full border-[hsl(var(--fauna-light)/50%)] focus:border-[hsl(var(--fauna-primary))] bg-white">
                                                                    <SelectValue placeholder="Sort by" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value={SortByEnum.Latest}>Newest First</SelectItem>
                                                                    <SelectItem value={SortByEnum.BestSelling}>Best Selling</SelectItem>
                                                                    <SelectItem value={SortByEnum.MinPrice}>Price: Low to High</SelectItem>
                                                                    <SelectItem value={SortByEnum.MaxPrice}>Price: High to Low</SelectItem>
                                                                    <SelectItem value={SortByEnum.Name}>Name (A-Z)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="price" className="border-[hsl(var(--fauna-light)/50%)]">
                                            <AccordionTrigger className="text-[hsl(var(--fauna-deep))]">Price Range</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="pt-4 px-2">
                                                    <Slider
                                                        value={priceRange}
                                                        min={0}
                                                        max={1000}
                                                        step={10}
                                                        onValueChange={(values) => {
                                                            setPriceRange(values as [number, number]);
                                                            form.setValue('minPrice', values[0]);
                                                            form.setValue('maxPrice', values[1]);
                                                        }}
                                                        className="my-6"
                                                    />
                                                    <div className="flex justify-between mt-2">
                                                        <div className="border rounded p-2 w-[45%] text-center bg-white">${priceRange[0]}</div>
                                                        <div className="border rounded p-2 w-[45%] text-center bg-white">${priceRange[1]}</div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="tags" className="border-[hsl(var(--fauna-light)/50%)]">
                                            <AccordionTrigger className="text-[hsl(var(--fauna-deep))]">Tags</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="max-h-40 overflow-y-auto pr-2">
                                                    {Array.isArray(tags) && tags.length > 0 ? (
                                                        tags.map((tag) => (
                                                            <div key={tag.tagId} className="flex items-center space-x-2 py-1">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="tagIds"
                                                                    render={({ field }) => (
                                                                        <FormItem className="flex flex-row items-center space-x-2">
                                                                            <FormControl>
                                                                                <Checkbox
                                                                                    checked={(field.value ?? []).includes(tag.tagId)}
                                                                                    onCheckedChange={(checked) => {
                                                                                        const currentTags = field.value ?? [];
                                                                                        if (checked) {
                                                                                            field.onChange([...currentTags, tag.tagId]);
                                                                                        } else {
                                                                                            field.onChange(currentTags.filter((id) => id !== tag.tagId));
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel className="text-[hsl(var(--fauna-secondary))]">{tag.tagName}</FormLabel>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-[hsl(var(--fauna-secondary))]">No tags available</p>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="availability" className="border-[hsl(var(--fauna-light)/50%)]">
                                            <AccordionTrigger className="text-[hsl(var(--fauna-deep))]">Availability</AccordionTrigger>
                                            <AccordionContent>
                                                <FormField
                                                    control={form.control}
                                                    name="inStock"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-2">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value === true}
                                                                    onCheckedChange={(checked) => field.onChange(checked ? true : null)}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-[hsl(var(--fauna-secondary))]">In Stock Only</FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                    <div className="pt-4 space-y-2">
                                        <Button
                                            type="submit"
                                            className="w-full bg-[hsl(var(--fauna-primary))] hover:bg-[hsl(var(--fauna-deep))] text-white"
                                        >
                                            Apply Filters
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleResetFilters}
                                            className="w-full border-[hsl(var(--fauna-light)/50%)] text-[hsl(var(--fauna-secondary))] hover:bg-[hsl(var(--fauna-light)/20%)]"
                                        >
                                            Reset All
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </SheetContent>
                    </Sheet>
                </div>
                {appliedFilters.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {appliedFilters.map((filter, index) => (
                            <Badge
                                key={index}
                                className="bg-[hsl(var(--fauna-light)/30%)] text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light)/40%)] px-2 py-1 text-xs"
                            >
                                {filter}
                                <X size={10} className="ml-1 cursor-pointer" onClick={() => handleRemoveFilter(filter)} />
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
