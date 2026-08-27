"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import { getUserStats, UpdateProfile } from "./action";
import { toast } from "@/components/ui/toast";

function page() {
  const emptyUser = {
    name: "",
    email: "",
    bio: "",
  };
  const { user } = useUser();
  const [userData, setUserData] = useState(user ?? emptyUser);
  const [name, setName] = useState(user?.name ?? "");
  const [userStats, setUserStats] = useState({
    counts: 0,
    archived: 0,
    favorite: 0,
  });

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await UpdateProfile({ name: userData.name, bio: userData.bio });
    if (!res.success) {
      toast.add({ type: "error", description: res.message });
      return;
    }
    toast.add({ type: "success", description: "Save " });
    setUserData((prev) => ({
      ...prev,
      name: res.user.name,
      bio: res.user.bio,
    }));
    setName(res.user.name);
  };

  useEffect(() => {
    if (!user) {
      setUserData(emptyUser);
      setName("");
      return;
    }

    setUserData(user);
    setName(user.name ?? "");
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let getStats = async () => {
      const res = await getUserStats();
      if (!res.success) {
        toast.add({ type: "error", description: "Failed to load Stats" });
        return;
      }
      setUserStats(res.data);
    };
    getStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F9FAFE] dark:bg-[#070811] px-3 sm:px-6 py-6 ">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
      <p className="mt-2 text-muted-foreground">Your public information</p>

      <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-4 mt-6">
        <Card className={"bg-white shadow dark:bg-[#0D0F1D] "}>
          <CardContent className={"flex justify-center items-center flex-col "}>
            <div className="rounded-full h-20 w-20 bg-gradient-to-r from-violet-500 to-sky-500 flex items-center justify-center  text-2xl font-bold">
              {name[0]}
            </div>

            <h1 className="text-xl mt-2 font-semibold tracking-tight ">
              {name}
            </h1>
            <p className="mt-2 text-muted-foreground">{userData.email}</p>

            <div className="mt-4 grid grid-cols-3 gap-3 ">
              <div className="bg-indigo-50 dark:bg-[#1D2130] rounded-2xl py-2 px-4 text-center">
                <p className="font-bold text-lg">{userStats.counts}</p>
                <p className="text-xs text-muted-foreground">NOTES</p>
              </div>

              <div className="bg-indigo-50 dark:bg-[#1D2130] rounded-2xl py-2 px-4 text-center">
                <p className="font-bold text-lg">{userStats.favorite}</p>
                <p className="text-xs text-muted-foreground">FAV</p>
              </div>
              <div className="bg-indigo-50 dark:bg-[#1D2130] rounded-2xl py-2 px-4 text-center">
                <p className="font-bold text-lg">{userStats.archived}</p>
                <p className="text-xs text-muted-foreground">ARCH</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={"bg-white shadow dark:bg-[#0D0F1D] md:col-span-2"}>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate}>
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <Input
                      name="name"
                      type={"text"}
                      value={userData.name}
                      onChange={handleChange}
                      id="name"
                      className={"bg-[#F9FAFE]"}
                      placeholder="Jordan Lee"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      type={"email"}
                      value={userData.email}
                      name={"email"}
                      id="email"
                      className={"bg-[#F9FAFE]"}
                      placeholder="abc@gmail.com"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="textarea-message">Bio</FieldLabel>

                  <Textarea
                    name={"bio"}
                    onChange={handleChange}
                    value={userData.bio ?? ""}
                    className={"bg-[#F9FAFE]"}
                    id="textarea-message"
                    placeholder="Writer, thinker, collector of good ideas"
                  />
                </Field>

                <Field>
                  <div className="flex justify-end mt-4">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-violet-500 to-sky-500 text-white rounded-3xl"
                    >
                      Save Changes
                    </Button>
                  </div>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default page;
