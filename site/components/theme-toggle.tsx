"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const popupClass =
    "origin-[var(--transform-origin)] rounded-md bg-popover p-1 text-popover-foreground shadow-lg outline outline-1 outline-border transition-[transform,opacity,scale] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0";

const itemClass =
    "grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground";

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Always render Monitor icon during SSR to avoid hydration mismatch
    if (!mounted) {
        return (
            <Menu.Root>
                <Menu.Trigger
                    aria-label="Theme"
                    className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2"
                    )}
                >
                    <Monitor className="h-4 w-4" />
                </Menu.Trigger>
            </Menu.Root>
        );
    }

    const active = theme ?? resolvedTheme ?? "system";
    const Icon =
        active === "dark" ? Moon : active === "light" ? Sun : Monitor;

    return (
        <Menu.Root>
            <Menu.Trigger
                aria-label="Theme"
                className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2"
                )}
            >
                <Icon className="h-4 w-4" />
            </Menu.Trigger>

            <Menu.Portal>
                <Menu.Positioner sideOffset={8} className="outline-none">
                    <Menu.Popup className={popupClass}>
                        <Menu.Item className={itemClass} onClick={() => setTheme("light")}>
                            <Sun className="h-4 w-4" />
                            <span>Light</span>
                        </Menu.Item>
                        <Menu.Item className={itemClass} onClick={() => setTheme("dark")}>
                            <Moon className="h-4 w-4" />
                            <span>Dark</span>
                        </Menu.Item>
                        <Menu.Item className={itemClass} onClick={() => setTheme("system")}>
                            <Monitor className="h-4 w-4" />
                            <span>System</span>
                        </Menu.Item>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
}
