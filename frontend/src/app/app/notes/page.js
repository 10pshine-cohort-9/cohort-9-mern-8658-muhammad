import Notes from '@/components/notes'
function page() {
  return (
    <div className='m-4 grid grid-cols-3 gap-3 dark:bg-[#070811] min-h-screen'>
        <Notes/>
        <Notes/>
        <Notes/>

    </div>
  )
}

export default page