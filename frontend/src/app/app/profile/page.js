import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

function page() {
  return (
    <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] p-6 ">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
      <p className="mt-2 text-muted-foreground">Your public information</p>

    <div className="grid grid-cols-3 gap-4 mt-6">
    <Card className={"bg-white shadow dark:bg-[#0D0F1D] "}>
      <CardContent className={"flex justify-center items-center flex-col "}>
        <div className="rounded-full h-20 w-20 bg-gradient-to-r from-violet-500 to-sky-500 flex items-center justify-center  text-2xl font-bold"> G </div>
        
  <h1 className="text-xl mt-2 font-semibold tracking-tight text-white">Guest</h1>
    <p className="mt-2 text-muted-foreground">guest@notesphere.app</p>

    <div className="mt-4 grid grid-cols-3 gap-3 ">
      <div className="bg-indigo-50 dark:bg-[#1D2130] rounded-2xl py-2 px-4 text-center">
        <p className="font-bold text-lg">1</p>
<p className="text-xs text-muted-foreground">NOTES</p>
      </div>

      <div className="bg-indigo-50 dark:bg-[#1D2130] rounded-2xl py-2 px-4 text-center">
        <p className="font-bold text-lg">0</p>
<p className="text-xs text-muted-foreground">FAV</p>

      </div><div className="bg-indigo-50 dark:bg-[#1D2130] rounded-2xl py-2 px-4 text-center">
        <p className="font-bold text-lg">0</p>
<p className="text-xs text-muted-foreground">ARCH</p>
      </div>
      
    </div>
      
      </CardContent>
    </Card>


<Card className={"bg-white shadow dark:bg-[#0D0F1D] col-span-2"}>
  <CardHeader>
    <CardTitle>Personal Details</CardTitle>
  </CardHeader>
<CardContent>
  <div>
    <FieldGroup>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field >
        <FieldLabel htmlFor="name" >Full name</FieldLabel>
        <Input type={"text"} id="name" className={"bg-[#F9FAFE]"} placeholder="Jordan Lee"  />
      </Field>

      <Field >
        <FieldLabel htmlFor="email" >Full name</FieldLabel>
        <Input type={"email"} id="email" className={"bg-[#F9FAFE]"} placeholder="abc@gmail.com"  />
      </Field>

      </div>


<Field>
      <FieldLabel htmlFor="textarea-message">Message</FieldLabel>
     
      <Textarea  className={"bg-[#F9FAFE]"} id="textarea-message" placeholder="Writer, thinker, collector of good ideas" />
    </Field>


            <Field >
      <div className="flex justify-end mt-4">
        <Button
          type="button"
          className="bg-gradient-to-r from-violet-500 to-sky-500 text-white rounded-3xl"
        >
          Save Changes
        </Button>
      </div>
        </Field>



    </FieldGroup>
  </div>
</CardContent>

</Card>




    </div>

    </div>
  );
}

export default page;
