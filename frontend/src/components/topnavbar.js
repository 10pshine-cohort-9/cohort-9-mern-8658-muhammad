import { Menu, Moon, Sun, User2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

function TopNavBar({setSideOpen}) {
    const {theme, setTheme}=useTheme()
    const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  return (
    <div className='sticky h-16 flex flex-1  items-center justify-between px-7 bg-[#FAFBFD] border-b dark:border-b-gray-800 border-b-gray-100  dark:bg-slate-950/70 backdrop-blur-xl'>
        <div onClick={()=>setSideOpen((prev)=>!prev)} className='dark:text-gray-200 rounded-xl h-8 w-8 flex justify-center items-center text-gray-800 hover:bg-indigo-50 hover:dark:bg-indigo-950/60'><Menu className='size-5 '></Menu></div>

        <div className='flex items-center justify-center gap-3'>
                    <button 
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="h-8 w-8 rounded-xl flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60"
          >
           {mounted &&  theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
        
</button>
             <div className='rounded-full flex h-10 w-10 justify-center items-center bg-gradient-to-br from-violet-500 to-sky-500'>
                    <User2 className="size-4.5 font-bold text-white dark:text-gray-900"/>
                </div>
        </div>
    </div>
  )
}

export default TopNavBar