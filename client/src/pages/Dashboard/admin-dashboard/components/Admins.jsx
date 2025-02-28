import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit3 } from 'lucide-react';
import { SearchBar } from './common/SearchBar';
import toast from 'react-simple-toasts';

const Admins = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/admin/all-admins', {
          headers: { 'authorization': token, 'Content-Type': 'application/json' },
        });
        setAdmins(response.data);
        setFilteredAdmins(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(lowerCaseQuery) ||
        admin.email.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredAdmins(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4 text-center">Error: {error}</div>;
  }

  const handleRoleChange = async (admin) => {
    const confirmChange = window.confirm(
      `Do you want to change ${admin.name}'s role to User?`
    );
    if (confirmChange) {
      try {
        const token = localStorage.getItem('token');
        const adminId = admin.id;
  
        await axios.put(
          'http://localhost:3001/admin/change-role',
          { user_id: adminId, new_role: "user" },
          { headers: { authorization: token } }
        );
  
        // Update the admin role locally
        const updatedAdmins = admins.filter((a) => a.id !== adminId); // Remove the admin from the current list
        setAdmins(updatedAdmins);
        setFilteredAdmins(updatedAdmins);
  
        toast(`Role updated to "User" successfully!`);
      } catch (error) {
        toast(error.response ? error.response.data.message : 'Failed to update role!');
      }
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Admins</h1>

        <div className="flex gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <SearchBar
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left py-4 px-6 font-medium text-xs">Username</th>
                <th className="text-left py-4 px-6 font-medium text-xs">Email</th>
                <th className="text-left py-4 px-6 font-medium text-xs">Joined On</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-sm">{admin.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">{admin.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-500">{formatDate(admin.created_at)}</div>
                    </td>
                    <td>{/* Edit Role button */}
                      <button
                        onClick={() => handleRoleChange(admin)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit Role"
                      >
                        <Edit3 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-gray-500"
                  >
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admins;
