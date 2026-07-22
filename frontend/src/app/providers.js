<<<<<<< HEAD
"use client"
=======
"use client";
>>>>>>> 571e4ab3f220d283fcd665eccf2e7d7f810e7fd2
import { ThemeProvider } from "next-themes";
export default function Providers({ children }) {
    return (
        <ThemeProvider 
        attribute="class" defaultTheme="system" enableSystem
        >
            {children}
        </ThemeProvider>
    )
}