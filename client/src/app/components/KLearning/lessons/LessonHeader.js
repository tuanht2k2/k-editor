import Link from "next/link";

import {
  BadgeOutlined,
  EmailOutlined,
  SchoolOutlined,
} from "@mui/icons-material";

function LessonHeader({ currentPage, classId, userRole, userId }) {
  const pages = [
    {
      label: "Kênh chung",
      icon: (
        <EmailOutlined
          className={`text-gray-500 group-hover:text-red-500 ${
            currentPage == "general" && "text-red-500"
          }`}
        />
      ),
      path: "general",
    },
    {
      label: "Bài giảng",
      icon: (
        <SchoolOutlined
          className={`text-gray-500 group-hover:text-red-500 ${
            currentPage == "lessons" && "text-red-500"
          }`}
        />
      ),
      path: "lessons",
    },

    // {
    //   label: "Bài tập",
    //   icon: <HomeWorkOutlined className={`text-gray-500 group-hover:text-red-500 ${currentPage == "general" && "text-red-500"}`} />,
    //   path: "homework",
    // },
    // {
    //   label: "Bài thi",
    //   icon: <ReceiptLongOutlined className={`text-gray-500 group-hover:text-red-500 ${currentPage == "general" && "text-red-500"}`} />,
    //   path: "examination",
    // },
    {
      label: "Thành viên",
      icon: (
        <BadgeOutlined
          className={`text-gray-500 group-hover:text-red-500 ${
            currentPage == "members" && "text-red-500"
          }`}
        />
      ),
      path: "members",
    },
    // {
    //   label: "Cài đặt",
    //   icon: (
    //     <SchoolOutlined
    //       className={`text-gray-500 group-hover:text-red-500 ${
    //         currentPage == "lessons" && "text-red-500"
    //       }`}
    //     />
    //   ),
    //   path: "settings",
    //   type: "admin",
    // },
    {
      label: "Cá nhân",
      icon: (
        <SchoolOutlined
          className={`text-gray-500 group-hover:text-red-500 ${
            currentPage == "lessons" && "text-red-500"
          }`}
        />
      ),
      path: `member-overview/${userId}`,
      type: "member",
    },
  ];

  return (
    <div className="flex items-center justify-end">
      {pages.map((page, index) => {
        return (
          (!page.type || page.type == userRole) && (
            <Link
              key={`class-menu-${index}`}
              href={{
                pathname: `/k-learning/${classId}/${page.path}`,
              }}
              className={`flex justify-center items-center ml-3 p-2 duration-300 rounded-3xl group hover:bg-sky-500 ${
                currentPage == page.path.split("/")[0] && "bg-sky-500"
              }`}
            >
              {/* {page.icon} */}
              <span className={`ml-2 mr-2 text-sm text-gray-200 text-center`}>
                {page.label}
              </span>
            </Link>
          )
        );
      })}
    </div>
  );
}

export default LessonHeader;
