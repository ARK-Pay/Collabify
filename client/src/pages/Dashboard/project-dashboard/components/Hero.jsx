import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import UnifiedProjectTable from './UnifiedProjectTable';
import AddProjectModal from './project/AddProjectModal';
import { sidebarSelection } from '../../../../store/atoms/adminDashboardAtoms';
import { useRecoilValue } from 'recoil';
import UsersProject from './UsersProject';
import MyTasksTable from '../../my-tasks/MyTasksTable';
import Notifications from '../../notifications/Notifications';

  // Define the Hero component which takes sidebarOpen and setSidebarOpen as props
  const Hero = ({setSidebarOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedSidebar = useRecoilValue(sidebarSelection);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)} //  Open sidebar on button click
          >
            <Menu className="h-6 w-6" /> {/* Menu icon */}
          </button>
          {selectedSidebar === "projects" && ( // Conditional rendering based on selectedSidebar value
            <div>
              <h1 className="text-2xl font-semibold">Projects</h1> {/* Heading */}
              <p className="text-gray-600 text-sm mt-1">
                View and Manage Your Teams Projects {/* Subheading */}
              </p>
            </div>
          )}
        </div>
        {selectedSidebar === "projects" && ( // Conditional rendering based on selectedSidebar value
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} /> {/* Plus icon */}
            <span className="hidden sm:inline">Add Project</span>
          </button>
        )}
        {selectedSidebar === "your-projects" && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="hidden sm:inline">Add Project</span>
          </button>
        )}
      </div>

      {selectedSidebar === 'users' && <UsersProject />} {/* Conditional rendering for UsersProject component */}
      {selectedSidebar === 'notifications' && <Notifications />}
      {selectedSidebar === 'projects' && (
        <UnifiedProjectTable 
          endpoint="get-my-assigned-projects"
          title="Your assigned Projects"
          filterApproved={true}
        />
      )}
      {selectedSidebar === "tasks" && <MyTasksTable />} {/* Conditional rendering for MyTasksTable component */}
      {selectedSidebar === "your-projects" && (
        <UnifiedProjectTable 
          endpoint="my-created-projects"
          title="Your Created Projects"
          filterApproved={false}
        />
      )}
      {selectedSidebar==="created-tasks"&&<MyTasksTable type='created' />}

      <AddProjectModal isOpen={isModalOpen} onClose={closeModal} /> {/* AddProjectModal component */}
    </div>
  );
};

export default Hero;