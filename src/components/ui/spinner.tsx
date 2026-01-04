import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export const Spinner = ({ className }: { className?: string }) => {
    return (
        <Loader2 className={cn("h-4 w-4 animate-spin text-primary", className)} />
    );
};

export const FullPageSpinner = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background/50 backdrop-blur-sm fixed inset-0 z-50">
            <Spinner className="h-10 w-10 text-primary" />
        </div>
    );
};
