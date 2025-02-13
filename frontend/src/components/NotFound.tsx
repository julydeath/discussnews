import { Link } from "@tanstack/react-router";

import { Button } from "./ui/button";

/* eslint-disable react/react-in-jsx-scope */
export function Notfound() {
  return (
    <div className="flex flex-col items-center text-center justify-center mx-auto mt-20">
      <img
        src="/vecteezy_error-page-vector-free-download_10886262.jpg"
        alt="Page not found"
        className="max-w-3xl"
      />
      <Button>
        <Link to="/">Go to home</Link>
      </Button>
    </div>
  );
}
