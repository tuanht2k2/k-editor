import { RefreshOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

function CustomSpinningSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <CircularProgress size={20} className="text-sky-500 animate-spin" />
    </div>
  );
}

export default CustomSpinningSkeleton;
