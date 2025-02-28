export const TableHeader = () => (
  <tr className="border-b bg-gray-100">
    <th className="text-left py-4 px-6 font-medium text-xs">Name</th>
    <th className="text-left py-4 px-6 font-medium text-xs">Status</th>
    <th className="text-left py-4 px-6 font-medium text-xs">About</th>
    <th className="text-left py-4 px-6 font-medium text-xs">Members</th>
    <th className="text-left py-4 px-6 font-medium text-xs">Progress</th>
    <th className="text-left py-4 px-6 font-medium text-xs">Deadline</th> {/* New column */}
    <th className="w-10"></th>
  </tr>
);