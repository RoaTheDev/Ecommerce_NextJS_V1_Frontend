'use client';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {AlertCircle, ArrowUpDown, Edit, Loader2, MapPin, Plus, Star, Trash2} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Separator} from "@/components/ui/separator";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {
    useAddresses,
    useChangeDefaultAddress,
    useCreateAddress,
    useDeleteAddress,
    useUpdateAddress
} from '@/lib/queries/useAddressQueries';
import {useAddressStore} from '@/lib/stores/useAddressStore';
import {useAuthStore} from '@/lib/stores/useAuthStore';
import {AddressCreationRequest, AddressResponse} from '@/lib/types/addressTypes';
import {AnimatePresence, motion} from 'framer-motion';
import toast from 'react-hot-toast';
import {AddressFormValues, addressSchema} from "@/lib/schemas/addressSchema";

export const AddressTab: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);
    const [addressToDelete, setAddressToDelete] = useState<AddressResponse | null>(null);
    const [defaultChangeConfirmOpen, setDefaultChangeConfirmOpen] = useState(false);
    const [addressToSetDefault, setAddressToSetDefault] = useState<AddressResponse | null>(null);
    const {currentUser} = useAuthStore();

    const sortAddresses = (addresses: AddressResponse[]) => {
        return [...addresses].sort((a, b) => {
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;
            return a.city.localeCompare(b.city);
        });
    };

    const customerId = currentUser?.id ? parseInt(currentUser.id) : 0;

    const {
        addresses,
        setAddresses,
        removeAddress,
        setDefaultAddress,
        setLoading
    } = useAddressStore();

    const {data: addressesData, isLoading, isError, error, refetch} = useAddresses(customerId);
    const createAddressMutation = useCreateAddress(customerId);
    const updateAddressMutation = useUpdateAddress(customerId, editingAddress?.addressId || 0);
    const deleteAddressMutation = useDeleteAddress(customerId);
    const changeDefaultAddressMutation = useChangeDefaultAddress(customerId);

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            firstAddressLine: '',
            secondAddressLine: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }
    });

    useEffect(() => {
        if (addressesData) {
            setAddresses(sortAddresses(addressesData));
        }
    }, [addressesData, setAddresses]);

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    const onSubmit = (data: AddressFormValues) => {
        if (editingAddress) {
            updateAddressMutation.mutate({
                ...data
            }, {
                onSuccess: () => {
                    setOpen(false);
                    resetForm();
                }
            });
        } else {
            createAddressMutation.mutate(data as AddressCreationRequest, {
                onSuccess: () => {
                    setOpen(false);
                    resetForm();
                }
            });
        }
    };

    const handleEditAddress = (address: AddressResponse) => {
        setEditingAddress(address);
        form.reset({
            firstAddressLine: address.firstAddressLine,
            secondAddressLine: address.secondAddressLine || '',
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country
        });
        setOpen(true);
    };

    const handleOpenDeleteConfirm = (address: AddressResponse) => {
        setAddressToDelete(address);
        setConfirmDeleteOpen(true);
    };

    const handleDeleteAddress = () => {
        if (addressToDelete) {
            deleteAddressMutation.mutate(addressToDelete.addressId, {
                onSuccess: () => {
                    removeAddress(addressToDelete.addressId);
                    setConfirmDeleteOpen(false);
                    setAddressToDelete(null);
                },
                onError: () => {
                    setConfirmDeleteOpen(false);
                    setTimeout(async () => {
                        await refetch();
                    }, 500);
                }
            });
        }
    };

    const openDefaultAddressConfirm = (address: AddressResponse) => {
        if (address.isDefault) {
            toast.error("This address is already set as default");
            return;
        }

        setAddressToSetDefault(address);
        setDefaultChangeConfirmOpen(true);
    };

    const handleSetDefaultAddress = () => {
        if (addressToSetDefault) {
            changeDefaultAddressMutation.mutate(addressToSetDefault.addressId, {
                onSuccess: () => {
                    setDefaultAddress(addressToSetDefault.addressId);
                    setDefaultChangeConfirmOpen(false);
                    setAddressToSetDefault(null);
                    toast.success("Default address updated successfully");
                }
            });
        }
    };

    const resetForm = () => {
        setEditingAddress(null);
        form.reset({
            firstAddressLine: '',
            secondAddressLine: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        });
    };

    const addressCardVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {opacity: 1, y: 0, transition: {duration: 0.3}}
    };

    if (isLoading) {
        return (
            <div className="bg-[hsl(42,46%,94%)] rounded-lg p-4">
                <Card className="border-0 shadow-lg overflow-hidden bg-white">
                    <CardHeader
                        className="bg-gradient-to-r from-[hsl(148,58%,55%)/80] to-[hsl(148,58%,55%)/20] py-6"
                    >
                        <CardTitle className="text-[hsl(149,41%,39%)] text-xl font-semibold flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-[hsl(149,41%,39%)]"/>
                            My Shipping Addresses
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center min-h-[300px]">
                            <div className="flex flex-col items-center gap-3">
                                <div
                                    className="animate-spin rounded-full h-8 w-8 border-t-2 border-[hsl(148,58%,55%)]"></div>
                                <p className="text-[hsl(32,32%,41%)]">Loading your addresses...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-[hsl(42,46%,94%)] rounded-lg p-4">
                <Card className="border-0 shadow-lg overflow-hidden bg-white">
                    <CardHeader
                        className="bg-gradient-to-r from-[hsl(148,58%,55%)/80] to-[hsl(148,58%,55%)/20] py-6"
                    >
                        <CardTitle className="text-[hsl(149,41%,39%)] text-xl font-semibold flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-[hsl(149,41%,39%)]"/>
                            My Shipping Addresses
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-800"/>
                            <AlertTitle className="text-red-800 font-semibold">Error</AlertTitle>
                            <AlertDescription className="text-red-800">
                                {error?.response?.data?.detail || "There was an error loading your addresses. Please try again later."}
                            </AlertDescription>
                        </Alert>
                        <div className="flex justify-center mt-6">
                            <Button
                                onClick={() => refetch()}
                                className="bg-[hsl(148,58%,55%)] hover:bg-[hsl(149,41%,39%)] text-white"
                            >
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="bg-[hsl(42,46%,94%)] rounded-lg p-4">
            <Card className="border-0 shadow-lg overflow-hidden bg-white">
                <CardHeader
                    className="bg-gradient-to-r from-[hsl(148,58%,55%)/80] to-[hsl(148,58%,55%)/20] py-6 flex flex-row justify-between items-center"
                >
                    <CardTitle className="text-[hsl(149,41%,39%)] text-xl font-semibold flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-[hsl(149,41%,39%)]"/>
                        My Shipping Addresses
                    </CardTitle>
                    <Dialog open={open} onOpenChange={(value) => {
                        setOpen(value);
                        if (!value) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button
                                className="bg-[hsl(148,58%,55%)] hover:bg-[hsl(149,41%,39%)] text-white shadow-md transition-all duration-300 hover:shadow-lg"
                            >
                                <Plus className="mr-2 h-4 w-4"/> Add Address
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-[hsl(148,58%,55%)/80] to-[hsl(148,58%,55%)/20] py-4 px-6">
                                <DialogTitle className="text-[hsl(149,41%,39%)] font-bold">
                                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                                </DialogTitle>
                            </div>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <Label className="text-[hsl(149,41%,39%)]">
                                            Address Line 1*
                                        </Label>
                                        <Controller
                                            name="firstAddressLine"
                                            control={form.control}
                                            render={({field}) => (
                                                <Input
                                                    {...field}
                                                    className="border-[hsl(138,49%,70%)] focus-visible:ring-[hsl(149,41%,39%)] mt-1"
                                                    placeholder="123 Fauna Street"
                                                />
                                            )}
                                        />
                                        {form.formState.errors.firstAddressLine && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {form.formState.errors.firstAddressLine.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-[hsl(149,41%,39%)]">
                                            Address Line 2
                                        </Label>
                                        <Controller
                                            name="secondAddressLine"
                                            control={form.control}
                                            render={({field}) => (
                                                <Input
                                                    {...field}
                                                    className="border-[hsl(138,49%,70%)] focus-visible:ring-[hsl(149,41%,39%)] mt-1"
                                                    placeholder="Apartment 4B (Optional)"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <Label className="text-[hsl(149,41%,39%)]">
                                            City*
                                        </Label>
                                        <Controller
                                            name="city"
                                            control={form.control}
                                            render={({field}) => (
                                                <Input
                                                    {...field}
                                                    className="border-[hsl(138,49%,70%)] focus-visible:ring-[hsl(149,41%,39%)] mt-1"
                                                    placeholder="Greenville"
                                                />
                                            )}
                                        />
                                        {form.formState.errors.city && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {form.formState.errors.city.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-[hsl(149,41%,39%)]">
                                            State/Province*
                                        </Label>
                                        <Controller
                                            name="state"
                                            control={form.control}
                                            render={({field}) => (
                                                <Input
                                                    {...field}
                                                    className="border-[hsl(138,49%,70%)] focus-visible:ring-[hsl(149,41%,39%)] mt-1"
                                                    placeholder="Nature State"
                                                />
                                            )}
                                        />
                                        {form.formState.errors.state && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {form.formState.errors.state.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <Label className="text-[hsl(149,41%,39%)]">
                                            Postal Code*
                                        </Label>
                                        <Controller
                                            name="postalCode"
                                            control={form.control}
                                            render={({field}) => (
                                                <Input
                                                    {...field}
                                                    className="border-[hsl(138,49%,70%)] focus-visible:ring-[hsl(149,41%,39%)] mt-1"
                                                    placeholder="12345"
                                                />
                                            )}
                                        />
                                        {form.formState.errors.postalCode && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {form.formState.errors.postalCode.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-[hsl(149,41%,39%)]">
                                            Country*
                                        </Label>
                                        <Controller
                                            name="country"
                                            control={form.control}
                                            render={({field}) => (
                                                <Input
                                                    {...field}
                                                    className="border-[hsl(138,49%,70%)] focus-visible:ring-[hsl(149,41%,39%)] mt-1"
                                                    placeholder="Fauna Land"
                                                />
                                            )}
                                        />
                                        {form.formState.errors.country && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {form.formState.errors.country.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Separator className="my-4 bg-[hsl(138,49%,70%)]/30"/>

                                <div className="flex justify-end gap-2 mt-4">
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={resetForm}
                                            className="border-[hsl(32,32%,41%)] text-[hsl(32,32%,41%)] hover:bg-[hsl(138,49%,70%)]/10"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        className="bg-[hsl(148,58%,55%)] hover:bg-[hsl(149,41%,39%)] text-white transition-all duration-300"
                                        disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
                                    >
                                        {(createAddressMutation.isPending || updateAddressMutation.isPending) ? (
                                            <span className="flex items-center">
                                                <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                                Saving...
                                            </span>
                                        ) : (
                                            <span>{editingAddress ? 'Update Address' : 'Save Address'}</span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
                            <DialogHeader className="bg-red-500 py-4 px-6">
                                <DialogTitle className="text-white font-bold">Delete Address</DialogTitle>
                            </DialogHeader>
                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    <Alert className="border-yellow-200 bg-yellow-50">
                                        <AlertCircle className="h-4 w-4 text-yellow-800"/>
                                        <AlertDescription className="text-yellow-800">
                                            This action cannot be undone. This will permanently delete this address.
                                        </AlertDescription>
                                    </Alert>

                                    {addressToDelete && (
                                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-2">
                                            <p className="font-medium text-gray-800">{addressToDelete.firstAddressLine}</p>
                                            {addressToDelete.secondAddressLine && (
                                                <p className="text-gray-600">{addressToDelete.secondAddressLine}</p>
                                            )}
                                            <p className="text-gray-600">
                                                {addressToDelete.city}, {addressToDelete.state} {addressToDelete.postalCode}
                                            </p>
                                            <p className="text-gray-600">{addressToDelete.country}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setConfirmDeleteOpen(false);
                                            setAddressToDelete(null);
                                        }}
                                        className="border-gray-300 text-gray-700"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        onClick={handleDeleteAddress}
                                        disabled={deleteAddressMutation.isPending}
                                    >
                                        {deleteAddressMutation.isPending ? (
                                            <span className="flex items-center">
                                                <Loader2 className="animate-spin h-4 w-4 mr-2"/>
                                                Deleting...
                                            </span>
                                        ) : (
                                            "Delete Address"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Set Default Address Confirmation Dialog */}
                    <Dialog open={defaultChangeConfirmOpen} onOpenChange={setDefaultChangeConfirmOpen}>
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
                            <DialogHeader
                                className="bg-gradient-to-r from-[hsl(148,58%,55%)/80] to-[hsl(148,58%,55%)/20] py-4 px-6">
                                <DialogTitle className="text-[hsl(149,41%,39%)] font-bold">Set as Default
                                    Address</DialogTitle>
                            </DialogHeader>
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    Are you sure you want to set this address as your default shipping address?
                                </p>

                                {addressToSetDefault && (
                                    <div
                                        className="bg-[hsl(138,49%,70%)]/10 p-3 rounded-md border border-[hsl(138,49%,70%)]/30 mt-2">
                                        <p className="font-medium text-[hsl(149,41%,39%)]">{addressToSetDefault.firstAddressLine}</p>
                                        {addressToSetDefault.secondAddressLine && (
                                            <p className="text-gray-600">{addressToSetDefault.secondAddressLine}</p>
                                        )}
                                        <p className="text-gray-600">
                                            {addressToSetDefault.city}, {addressToSetDefault.state} {addressToSetDefault.postalCode}
                                        </p>
                                        <p className="text-gray-600">{addressToSetDefault.country}</p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDefaultChangeConfirmOpen(false);
                                            setAddressToSetDefault(null);
                                        }}
                                        className="border-[hsl(32,32%,41%)] text-[hsl(32,32%,41%)] hover:bg-[hsl(138,49%,70%)]/10"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-[hsl(148,58%,55%)] hover:bg-[hsl(149,41%,39%)] text-white"
                                        onClick={handleSetDefaultAddress}
                                        disabled={changeDefaultAddressMutation.isPending}
                                    >
                                        {changeDefaultAddressMutation.isPending ? (
                                            <span className="flex items-center">
                                                <Loader2 className="animate-spin h-4 w-4 mr-2"/>
                                                Setting default...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Star className="h-4 w-4"/>
                                                Set as Default
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                <CardContent className="p-6">
                    <AnimatePresence>
                        {addresses && addresses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((address) => (
                                    <motion.div
                                        key={address.addressId}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={addressCardVariants}
                                        className="h-full"
                                    >
                                        <Card
                                            className={`border-2 transition-all duration-300 h-full ${
                                                address.isDefault
                                                    ? 'border-[hsl(148,58%,55%)] shadow-md shadow-[hsl(148,58%,55%)]/20 bg-[hsl(148,58%,55%)]/5'
                                                    : 'border-gray-200 hover:border-[hsl(138,49%,70%)] hover:shadow-sm'
                                            }`}
                                        >
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-3">
                                                    {address.isDefault && (
                                                        <div
                                                            className="flex items-center text-[hsl(148,58%,55%)] text-sm font-medium bg-[hsl(148,58%,55%)]/15 py-1 px-3 rounded-full border border-[hsl(148,58%,55%)]/30">
                                                            <Star
                                                                className="mr-1 h-3 w-3 fill-[hsl(148,58%,55%)] text-[hsl(148,58%,55%)]"/>
                                                            Default Address
                                                        </div>
                                                    )}
                                                    <div className="flex space-x-1 ml-auto">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleEditAddress(address)}
                                                                        className="h-8 w-8 text-[hsl(149,41%,39%)] hover:bg-[hsl(138,49%,70%)]/10 rounded-full"
                                                                    >
                                                                        <Edit className="h-4 w-4"/>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Edit address</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        {!address.isDefault && (
                                                            <>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => openDefaultAddressConfirm(address)}
                                                                                className="h-8 w-8 text-[hsl(148,58%,55%)] hover:bg-[hsl(138,49%,70%)]/10 rounded-full"
                                                                            >
                                                                                <Star className="h-4 w-4"/>
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Set as default</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>

                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => handleOpenDeleteConfirm(address)}
                                                                                className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-full"
                                                                            >
                                                                                <Trash2 className="h-4 w-4"/>
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Delete address</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-2">
                                                    <p className={`font-semibold ${address.isDefault ? 'text-[hsl(149,41%,39%)]' : 'text-gray-800'}`}>
                                                        {address.firstAddressLine}
                                                    </p>
                                                    {address.secondAddressLine && (
                                                        <p className="text-gray-600 mt-1">{address.secondAddressLine}</p>
                                                    )}
                                                    <p className="text-gray-600 mt-1">
                                                        {address.city}, {address.state} {address.postalCode}
                                                    </p>
                                                    <p className="text-gray-600 mt-1">{address.country}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                className="text-center py-16"
                            >
                                <div className="bg-[hsl(138,49%,70%)]/10 inline-flex rounded-full p-4 mb-4">
                                    <MapPin className="h-8 w-8 text-[hsl(148,58%,55%)]"/>
                                </div>
                                <h3 className="font-medium text-lg text-[hsl(149,41%,39%)] mb-1">No addresses yet</h3>
                                <p className="text-[hsl(32,32%,41%)] max-w-md mx-auto">
                                    {"You haven't added any shipping addresses to your account. Add your first address to make checkout faster."}
                                </p>
                                <Button
                                    onClick={() => setOpen(true)}
                                    className="mt-4 bg-[hsl(148,58%,55%)] hover:bg-[hsl(149,41%,39%)] text-white"
                                >
                                    <Plus className="mr-2 h-4 w-4"/> Add Your First Address
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>

                {addresses && addresses.length > 0 && (
                    <CardFooter className="bg-[hsl(138,49%,70%)]/5 px-6 py-4 flex justify-between">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-[hsl(32,32%,41%)]">
                                <span
                                    className="font-medium">{addresses.length}</span> {addresses.length === 1 ? 'address' : 'addresses'} saved
                            </p>
                            {addresses.some(a => a.isDefault) && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="flex items-center text-[hsl(148,58%,55%)] text-xs bg-[hsl(148,58%,55%)]/10 py-1 px-2 rounded-full">
                                                <Star className="mr-1 h-3 w-3 fill-[hsl(148,58%,55%)]"/>
                                                Default set
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>You have a default address selected</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        {addresses.length > 1 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[hsl(149,41%,39%)] hover:bg-[hsl(138,49%,70%)]/10 flex items-center gap-1"
                                onClick={() => {
                                    const sorted = [...addresses].sort((a, b) =>
                                        a.city.localeCompare(b.city)
                                    );
                                    setAddresses(sorted);
                                    toast.success('Addresses sorted by city');
                                }}
                            >
                                <ArrowUpDown className="h-3 w-3"/> Sort by City
                            </Button>
                        )}
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};