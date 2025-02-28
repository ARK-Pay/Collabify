import { useState, useEffect } from 'react'; // Importing React hooks for state and lifecycle management
import { projectService } from '../services/api'; // Importing the project service for API calls

// Custom hook to manage project data based on a search query
export const useProjects = (searchQuery = '') => {
  const [projects, setProjects] = useState([]); // State to hold the list of projects
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to hold any error messages

  useEffect(() => {
    // Function to fetch projects from the API
    const fetchProjects = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        // Fetch data based on the search query
        const data = searchQuery
          ? await projectService.searchProjects(searchQuery) // Search for projects if a query is provided
          : await projectService.getAllProjects(); // Otherwise, get all projects
        setProjects(data); // Update the projects state with the fetched data
        setError(null); // Clear any previous error
      } catch (err) {
        setError(err.message); // Set error state if an error occurs
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    // Debounce search queries to limit API calls
    const timeoutId = setTimeout(() => {
      fetchProjects(); // Call the fetchProjects function after a delay
    }, searchQuery ? 300 : 0); // Delay only if there is a search query

    return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout
  }, [searchQuery]); // Effect runs when searchQuery changes

  return { projects, loading, error }; // Return the projects, loading status, and error
};