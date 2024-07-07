"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useAuth from "@/lib/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  BotIcon,
  Clock1Icon,
  Disc3Icon,
  Link2Icon,
  PowerIcon,
} from "lucide-react";

export default function Component() {
  const router = useRouter();
  const user = useAuth();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="container">
      <header className="px-4 lg:px-6 h-[10vh] border-b flex items-center">
        <Link
          href="/"
          className="flex gap-2 items-center justify-center"
          prefetch={false}
        >
          <BotIcon className="h-6 w-6" />
          <span className="font-semibold">InterviewPal</span>
        </Link>
        <nav className="ml-auto flex gap-4 items-center sm:gap-6">
          <Link
            href="#"
            className="font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#"
            className="font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className=" font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link href="/interview">
                <Button variant="outline">Start Interview</Button>
              </Link>
              <Button onClick={handleSignOut}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link href="/auth/signup">
                <Button variant="secondary">Sign Up</Button>
              </Link>
              <Link href="/auth/login">
                <Button>Sign In</Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="w-full h-[90vh] flex py-20 justify-center items-center">
        <div className="container h-[70vh] flex gap-10">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                A new way to learn & get knowledge
              </h1>
              <p className="text-muted-foreground py-4">
                EduFlex is here for you with various courses & materials from
                skilled tutors all around the world
              </p>
              <div className="flex space-x-4">
                <Link href="/interview">
                  <Button>Start Interview</Button>
                </Link>
                <Button variant="outline">Dashboard</Button>
              </div>
              <div className="flex space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">15,2K</div>
                  <p className="text-muted-foreground">Active students</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4,5K</div>
                  <p className="text-muted-foreground">Tutors</p>
                </div>
                <div className="text-center">
                  <PowerIcon className="w-8 h-8 mx-auto" />
                  <p className="text-muted-foreground">Resources</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold pb-6">Powered By</h2>
              <div className="flex flex-wrap gap-10">
                <img
                  src="https://asset.brandfetch.io/idKvKR3Cea/idPCglRaAU.png"
                  width="150"
                  alt=""
                />
                <img
                  src="https://asset.brandfetch.io/idKvKR3Cea/idPCglRaAU.png"
                  width="150"
                  alt=""
                />
                <img
                  src="https://asset.brandfetch.io/idKvKR3Cea/idPCglRaAU.png"
                  width="150"
                  alt=""
                />
                <img
                  src="https://asset.brandfetch.io/idKvKR3Cea/idPCglRaAU.png"
                  width="150"
                  alt=""
                />
                <img
                  src="https://asset.brandfetch.io/idKvKR3Cea/idPCglRaAU.png"
                  width="150"
                  alt=""
                />
                <img
                  src="https://asset.brandfetch.io/idKvKR3Cea/idPCglRaAU.png"
                  width="150"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden flex justify-end items-center">
            <img src="/hero.png" width="80%" alt="" />
          </div>
        </div>
      </section>
    </div>
  );
}
