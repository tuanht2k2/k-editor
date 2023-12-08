"use client";

import FileExplore from "@/app/components/FileExploreComponents/FileExplore";
import Custom404 from "@/app/components/Custom404";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import { Fragment } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import CreateFile from "./CreateFile";
import AccessFile from "./AcessFile";
import { Snackbar } from "@mui/material";

function FileExploreLayout({ componentType }) {
  const user = useSelector((state) => state.user);

  const [isFileExploreLoaded, setIsFileExploreLoaded] = useState(false);

  const [fileExplore, setFileExplore] = useState({
    folders: null,
    files: null,
  });

  const [isAvailbleFolder, setIsAvailbleFolder] = useState(true);

  //checking current page: home or sub folder
  const currentPath = usePathname().split("/");
  const currentFolderId = currentPath[currentPath.length - 1];

  const handleGetFolderData = () => {
    if (Object.keys(user).length <= 0) return;

    const config = getApiConfig();
    const folderId = currentFolderId == "home" ? "root" : currentFolderId;
    const api = `folders/userid=${user._id}&folderid=${folderId}&fileformat=${
      componentType == "file-explore"
        ? "any"
        : componentType == "k-word"
        ? "txt"
        : "xlsx"
    }`;

    instance
      .get(api, config)
      .then((res) => {
        if (res.status !== 200) {
          setIsAvailbleFolder(false);
          return;
        }
        setFileExplore(res.data);
        setIsFileExploreLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setIsAvailbleFolder(false);
      });
  };

  useEffect(() => {
    handleGetFolderData();
  }, [user]);

  return (
    <Fragment>
      {isAvailbleFolder ? (
        <div className="p-6">
          {componentType !== "file-explore" ? (
            <div className="w-full flex">
              <CreateFile
                fileExplore={fileExplore}
                componentType={componentType}
                handleReload={handleGetFolderData}
              />
              <div className="ml-4">
                <AccessFile componentType={componentType} />
              </div>
            </div>
          ) : (
            <div className="w-full flex">
              <AccessFile componentType={"k-word"} />
              <div className="ml-4">
                <AccessFile componentType={"k-sheet"} />
              </div>
            </div>
          )}

          <FileExplore
            componentType={componentType}
            userId={user?._id}
            parentFolder={fileExplore.folders?.folder}
            folders={fileExplore.folders?.subFolders}
            files={fileExplore.files}
            isFileExploreLoaded={isFileExploreLoaded}
            handleGetFolderData={handleGetFolderData}
          />
        </div>
      ) : (
        <Custom404 />
      )}
    </Fragment>
  );
}

export default FileExploreLayout;
