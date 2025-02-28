export const SearchBar = ({ value, onChange }) => (
  <div className="relative flex justify-end">
    <input
      type="text"
      placeholder="Search for users..."
      className="pl-4 pr-4 py-2 border rounded-lg w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={onChange}
    />
  </div> 
); 