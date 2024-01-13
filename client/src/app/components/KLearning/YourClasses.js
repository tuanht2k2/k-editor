"use client";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomSkeleton from "../CustomSkeleton";

function YourClasses({ className }) {
  const user = useSelector((state) => state.user);

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [yourClasses, setYourClasses] = useState([]);

  const handleGetYourClasses = () => {
    const api = `classes/user=${user._id}/all-classes/role=admin`;
    instance
      .get(api, getApiConfig())
      .then((res) => {
        setYourClasses(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsPageLoaded(true);
      });
  };

  useEffect(() => {
    handleGetYourClasses();
  }, []);

  return (
    <div className={className}>
      <header className="flex item-center font-semibold text-lg text-slate-700">
        Lớp học bạn sở hữu
      </header>
      <div className="mt-2">
        {isPageLoaded && yourClasses.length == 0 ? (
          <span className="text-slate-600">Bạn chưa sở hữu lớp học nào</span>
        ) : !isPageLoaded ? (
          <CustomSkeleton />
        ) : (
          <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {yourClasses.map((classData, index) => {
              return (
                <li key={`classes-${index}`}>
                  <Link
                    href={{
                      pathname: `/k-learning/${classData._id}/general`,
                      query: {
                        class_name: classData.classname,
                        class_id: classData._id,
                      },
                    }}
                    className="h-full border-2 border-slate-200 rounded-2xl p-4 flex flex-col items-center"
                  >
                    <div className="bg-sky-600 p-3 text-lg rounded-lg text-white">
                      {classData.classname[0]}
                    </div>
                    <span className="mt-2 text-center">
                      {classData.classname}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default YourClasses;
