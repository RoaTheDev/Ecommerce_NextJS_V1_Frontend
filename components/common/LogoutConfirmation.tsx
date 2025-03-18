'use client';

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLogout } from "@/lib/queries/useAuthQueries";

export default function LogoutConfirmation() {
    const [open, setOpen] = useState(false);
    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-[hsl(var(--fauna-secondary))] hover:bg-[hsl(var(--fauna-background))]"
                >
                    <LogOut size={20} />
                    Logout
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[hsl(var(--fauna-background))] border-[hsl(var(--fauna-light))] shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-[hsl(var(--fauna-deep))] text-lg font-semibold">
                        Confirm Logout
                    </DialogTitle>
                    <DialogDescription className="text-[hsl(var(--fauna-secondary))]">
                        Are you sure you want to log out? You will need to sign in again to access your account.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="border-[hsl(var(--fauna-light))] text-[hsl(var(--fauna-deep))] hover:bg-[hsl(var(--fauna-light))]/20"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="bg-[hsl(var(--fauna-primary))] text-white hover:bg-[hsl(var(--fauna-deep))]"
                    >
                        {logoutMutation.isPending ? "Signing out..." : "Logout"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
