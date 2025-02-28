import { Search } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
      <Search className="h-4 w-4 text-gray-400" />
    </div>
    <input
      type="text"
      placeholder={placeholder}
      className="pl-10 pr-4 py-2 border rounded-lg w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={onChange}
    />
  </div>
);