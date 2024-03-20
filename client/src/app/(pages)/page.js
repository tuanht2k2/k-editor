import { Button } from "@mui/material";
import Link from "next/link";

function HomePage() {
  return (
    <div className="items-center justify-center flex w-full h-full bg-gray-100">
      <div className="rounded-md bg-white p-2 flex">
        <button className="rounded-lg bg-gray-100 duration-300 hover:bg-gray-200">
          <Link
            href={"/login"}
            className="w-full h-full flex items-center justify-center p-3 text-blue-500"
          >
            Đăng nhập
          </Link>
        </button>
        <button className="ml-2 rounded-lg bg-sky-500 duration-300 hover:bg-sky-600">
          <Link
            href={"/register"}
            className="w-full h-full flex items-center justify-center p-3 text-white"
          >
            Đăng ký
          </Link>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
