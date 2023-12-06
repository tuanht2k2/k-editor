import Skeleton from "@mui/material/Skeleton";

function CustomSkeleton() {
  return (
    <div>
      <Skeleton animation="wave" height={40} />
      <Skeleton animation="wave" height={40} />
    </div>
  );
}

export default CustomSkeleton;
