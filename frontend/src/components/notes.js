import React from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { MoreVertical, Pin, Star } from 'lucide-react'
import { Button } from './ui/button'

function Notes() {
  return (
    <div>
        <Card className={"font-sans dark:border-b-gray-800 border-b-gray-100  dark:bg-[#101321] h-64  shadow-xs group hover:shadow-[0_10px_35px_rgba(139,92,246,0.4)]   m-2   transition-all duration-300 hover:ring-violet-300" }>
            <CardHeader>
                <CardTitle >
                <div className={"flex items-center gap-4"}>
                    <Pin className='size-4 text-violet-700'/> 
                <div className='bg-indigo-50 rounded-full text-gray-700 font-semibold  px-2 py-1.5 text-xs '>Personal</div>
                </div>
                <h2 className='mt-3 '>Welcome to NoteSphere ✨</h2>
                </CardTitle >
                <CardAction> <button type="button" aria-label="Toggle favorite"><Star className='size-4'></Star></button></CardAction>
                <CardDescription ></CardDescription>
                 </CardHeader>
                <CardContent className={""} > 
                    <div className={"line-clamp-3  dark:text-gray-400 text-gray-600 p-0"}>
                         Hello there! This is your first note. Try creating a new one, favorite it, or archive it. Everything is stored locally in your browser. Rich text editor Tags & ...
                    </div>
                    <div className='flex gap-3 mt-4 '> 
                        <div className='w-fit dark:bg-[#2B2654] dark:text-gray-200 bg-violet-100 rounded-full text-gray-700 font-semibold py-1 px-2  text-[10px] '>
                            #intro
                        </div>

                         <div className='w-fit dark:bg-[#2B2654] dark:text-gray-200 bg-violet-100 rounded-full text-gray-700 font-semibold py-1 px-2  text-[10px] '>
                            #Welcome
                        </div>

                         <div className='w-fit dark:bg-[#2B2654] dark:text-gray-200 bg-violet-100 rounded-full text-gray-700 font-semibold py-1 px-2  text-[10px] '>
                            #roadmap
                        </div>




                        
                        </div>
                </CardContent>
                <CardFooter className={"border-0 bg-transparent mt-0 pt-0 flex justify-between"}>
                  <p className='text-gray-700 dark:text-gray-200 text-xs font-sans'>about 10 hours ago</p>
<MoreVertical className="size-4 text-gray-800 opacity-0  dark:text-gray-200 transition-all duration-200 group-hover:opacity-100" />                </CardFooter>
                
           
        </Card>
    </div>
  )
}

export default Notes