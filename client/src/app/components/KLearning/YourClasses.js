import Link from "next/link";

function YourClasses({ className, yourClasses }) {
  return (
    <div className={className}>
      <div className="mt-2">
        {yourClasses.length == 0 ? (
          <span className="text-slate-600">Bạn chưa sở hữu lớp học nào</span>
        ) : (
          <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {yourClasses.map((classData, index) => {
              return (
                <li key={`classes-${index}`}>
                  <Link
                    href={{
                      pathname: `/k-learning/${classData._id}/general`,
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
