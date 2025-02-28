import { getStatusColor } from "../../utils/helpers";

export const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex justify-center items-center w-20 px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}
    style={{ whiteSpace: 'nowrap' }} // Prevents the text from wrapping
  >
    {status}
  </span>
);
