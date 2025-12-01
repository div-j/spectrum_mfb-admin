import React from "react";

export default function Hero() {
  return (
    <section className="pt-16 pb px-4">
      <div className="container mx-auto text-center max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to Spectrum MFB Admin Portal
          <span className="block text-blue-600 mt-2">
            Corporate Banking Solutions
          </span>
        </h2>
        <p className="text-xl text-gray-600  max-w-2xl mx-auto">
          Secure, efficient, and comprehensive banking services designed for
          corporate clients and financial institutions.
        </p>
      </div>
    </section>
  );
}
