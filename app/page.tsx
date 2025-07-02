import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Intelligent Receipt Scannig
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
                Scan, analyze and organize your receipts with AI-Powered
                precision. Save time and gain insights from the expenses.
              </p>
            </div>

            <div className="space-y-4">
              <Link href={"/receipts"}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={"#features"}>
                {" "}
                <Button variant={"outline"}>Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features */}

      {/* Pricing */}

      {/* Info */}

      {/* Footer */}
    </div>
  );
};

export default Home;
