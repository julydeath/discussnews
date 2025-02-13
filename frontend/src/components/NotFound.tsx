import { Button } from "./ui/button";

/* eslint-disable react/react-in-jsx-scope */
export function Notfound() {
  return (
    <div className="flex flex-col items-center text-center justify-center h-screen ">
      <img
        src="/vecteezy_error-page-vector-free-download_10886262.jpg"
        alt="Page not found"
      />
      <Button className="">Go to home</Button>
    </div>
  );
}
