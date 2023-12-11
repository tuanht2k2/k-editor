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
import { Skeleton } from "@mui/material";

function FileExploreLayout({ componentType }) {
  const user = useSelector((state) => state.user);

  const [isFileExploreLoaded, setIsFileExploreLoaded] = useState(false);

  const [fileExplore, setFileExplore] = useState({
    folders: null,
    files: null,
    recentFiles: null,
  });

  const [isAvailbleFolder, setIsAvailbleFolder] = useState(true);

  //checking current page: home or sub folder
  const currentPath = usePathname().split("/");
  const currentFolderId = currentPath[currentPath.length - 1];

  const handleGetFolderData = () => {
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
        setFileExplore((prev) => ({ ...prev, ...res.data }));
        handleGetRecentFiles();
      })
      .catch(() => {
        setIsAvailbleFolder(false);
      });
  };

  const handleGetRecentFiles = () => {
    const api = `/files/get-file-list/format=${
      componentType == "file-explore"
        ? "any"
        : componentType == "k-word"
        ? "txt"
        : "xlsx"
    }`;
    const recentFileIds = user.recentFiles;
    if (!recentFileIds) {
      setIsFileExploreLoaded(true);
      return;
    }
    instance
      .post(api, recentFileIds, getApiConfig())
      .then((res) =>
        setFileExplore((prev) => ({
          ...prev,
          recentFiles: [...res.data].reverse(),
        }))
      )
      .finally(() => {
        setIsFileExploreLoaded(true);
      });
  };

  useEffect(() => {
    if (Object.keys(user).length == 0) return;
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
            recentFiles={fileExplore.recentFiles}
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
