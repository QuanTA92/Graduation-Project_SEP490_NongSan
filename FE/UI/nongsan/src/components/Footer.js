import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-100/80 font-sans dark:bg-gray-800">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <h1 className="text-lg font-semibold tracking-tight text-green-900 xl:text-xl dark:text-white">
              Subscribe to our newsletter for the latest updates.
            </h1>

            <div className="flex flex-col mx-auto mt-4 space-y-3 md:space-y-0 md:flex-row">
              <input
                id="email"
                type="text"
                className="px-3 py-1.5 text-sm text-green-800 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-green-400 dark:focus:border-green-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-green-300"
                placeholder="Email Address"
              />
              <button className="w-full px-4 py-1.5 mt-3 text-sm font-medium tracking-wider text-white transition-colors duration-300 transform md:mt-0 md:w-auto md:mx-4 focus:outline-none bg-green-700 rounded-lg hover:bg-green-600 focus:ring focus:ring-green-300 focus:ring-opacity-80">
                Subscribe
              </button>
            </div>
          </div>

          <div>
            <p className="font-semibold text-green-900 dark:text-white">Quick Links</p>
            <div className="flex flex-col items-start mt-4 space-y-1 text-sm">
              <p className="text-green-700 dark:text-gray-300 hover:underline hover:text-green-600 cursor-pointer">
                Home
              </p>
              <p className="text-green-700 dark:text-gray-300 hover:underline hover:text-green-600 cursor-pointer">
                Who We Are
              </p>
              <p className="text-green-700 dark:text-gray-300 hover:underline hover:text-green-600 cursor-pointer">
                Our Philosophy
              </p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-green-900 dark:text-white">Industries</p>
            <div className="flex flex-col items-start mt-4 space-y-1 text-sm">
              <p className="text-green-700 dark:text-gray-300 hover:underline hover:text-green-600 cursor-pointer">
                Retail & E-Commerce
              </p>
              <p className="text-green-700 dark:text-gray-300 hover:underline hover:text-green-600 cursor-pointer">
                Information Technology
              </p>
              <p className="text-green-700 dark:text-gray-300 hover:underline hover:text-green-600 cursor-pointer">
                Finance & Insurance
              </p>
            </div>
          </div>
        </div>

        <hr className="my-4 border-green-300 dark:border-gray-700" />

        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-4 cursor-pointer">
            <img
              src="https://www.svgrepo.com/show/303139/google-play-badge-logo.svg"
              width="100"
              height="80"
              alt=""
            />
            <img
              src="https://www.svgrepo.com/show/303128/download-on-the-app-store-apple-logo.svg"
              width="100"
              height="80"
              alt=""
            />
          </div>

          <div className="flex gap-2 mt-4 sm:mt-0 cursor-pointer">
            <img
              src="https://www.svgrepo.com/show/303114/facebook-3-logo.svg"
              width="24"
              height="24"
              alt="fb"
            />
            <img
              src="https://www.svgrepo.com/show/303115/twitter-3-logo.svg"
              width="24"
              height="24"
              alt="tw"
            />
            <img
              src="https://www.svgrepo.com/show/303145/instagram-2-1-logo.svg"
              width="24"
              height="24"
              alt="inst"
            />
            <img
              src="https://www.svgrepo.com/show/94698/github.svg"
              width="24"
              height="24"
              alt="gt"
            />
            <img
              src="https://www.svgrepo.com/show/22037/path.svg"
              width="24"
              height="24"
              alt="pn"
            />
            <img
              src="https://www.svgrepo.com/show/28145/linkedin.svg"
              width="24"
              height="24"
              alt="in"
            />
            <img
              src="https://www.svgrepo.com/show/22048/dribbble.svg"
              width="24"
              height="24"
              alt="db"
            />
          </div>
        </div>

        <p className="text-xs text-center mt-4 text-green-800 dark:text-gray-300">
          © 2023 Your Company Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
