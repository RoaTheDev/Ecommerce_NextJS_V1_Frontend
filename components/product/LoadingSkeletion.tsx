import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";

export function LoadingSkeletons({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {Array(count).fill(0).map((_, i) => (
                <Card key={i} className="h-full">
                    <Skeleton className="aspect-square w-full" />
                    <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        <Skeleton className="h-6 w-1/3" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}