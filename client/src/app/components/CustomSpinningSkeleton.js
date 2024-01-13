import { RefreshOutlined } from "@mui/icons-material";

function CustomSpinningSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <RefreshOutlined className="text-sky-500 animate-spin" />
    </div>
  );
}

export default CustomSpinningSkeleton;
