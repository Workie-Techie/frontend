import React, { useState, useEffect } from 'react';
import FreelancerCard from '../components/FreelancerCard';
import profileService from '../services/profileService'; // Assuming this service exists and works as expected

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  // A placeholder for available skills - in a real app, this might come from an API
  const [availableSkills, setAvailableSkills] = useState([
    { id: 'react', name: 'React' },
    { id: 'python', name: 'Python' },
    { id: 'design', name: 'Design' },
    { id: 'writing', name: 'Content Writing' },
    { id: 'vue', name: 'Vue.js' },
    { id: 'node', name: 'Node.js' },
    { id: 'marketing', name: 'Digital Marketing' },
    // Add more skills as needed
  ]);

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        setLoading(true);
        const filters = {};

        if (searchTerm) {
          filters.search = searchTerm;
        }

        if (skillFilter) {
          filters.skills__name__icontains = skillFilter; // Adjusted to a common API filtering convention for related fields
        }

        // In a real profileService.getFreelancers, you'd pass pagination and filter parameters
        // e.g., profileService.getFreelancers({ page: currentPage, search: searchTerm, skill: skillFilter })
        const response = await profileService.getFreelancers(currentPage, filters);

        // Assuming the API response structure is { results: [...], count: totalItems }
        if (response && response.results && typeof response.count === 'number') {
          setFreelancers(response.results);
          setTotalPages(Math.ceil(response.count / 10)); // Assuming 10 results per page
          setError(null);
        } else {
          // Handle unexpected response structure
          console.error('Unexpected API response structure:', response);
          setError('Failed to parse freelancer data.');
          setFreelancers([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Failed to load freelancers:', err);
        setError('Unable to load freelancers. Please try again later.');
        setFreelancers([]); // Clear freelancers on error
        setTotalPages(1);   // Reset total pages on error
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, [currentPage, searchTerm, skillFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search/filter
    // The useEffect hook will trigger loadFreelancers due to searchTerm or skillFilter change
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    }
  };

  const handleRetry = () => {
    setError(null);
    setCurrentPage(1); // Optionally reset to page 1 or try current page again
    // The useEffect will trigger a reload
  };


  // Function to generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Max number of page buttons to show (e.g., 1 ... 4 5 6 ... 10)
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);

    if (currentPage - halfMaxPages < 1) {
        endPage = Math.min(totalPages, maxPagesToShow);
    }

    if (currentPage + halfMaxPages > totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }


    // "First" button
    if (currentPage > 1 + halfMaxPages && totalPages > maxPagesToShow) {
        items.push(
            <button
                key="first"
                onClick={() => handlePageChange(1)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
                1
            </button>
        );
        if (startPage > 2) {
             items.push(<span key="start-ellipsis" className="px-3 py-1.5 text-sm text-gray-500">...</span>);
        }
    }


    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            ${currentPage === i
              ? 'bg-blue-600 text-white border border-blue-600'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
        >
          {i}
        </button>
      );
    }

    // "Last" button
     if (currentPage < totalPages - halfMaxPages && totalPages > maxPagesToShow) {
        if (endPage < totalPages -1) {
            items.push(<span key="end-ellipsis" className="px-3 py-1.5 text-sm text-gray-500">...</span>);
        }
        items.push(
            <button
                key="last"
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
                {totalPages}
            </button>
        );
    }

    return items;
  };


  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Find Top Freelancers
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with skilled professionals ready to bring your projects to life.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10 sticky top-4 z-10"> {/* Made sticky */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow w-full md:w-auto">
              <label htmlFor="search-term" className="sr-only">Search by name, title or skill</label>
              <input
                id="search-term"
                type="text"
                placeholder="Search by name, title, keyword..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto md:min-w-[200px]">
              <label htmlFor="skill-filter" className="sr-only">Filter by skill</label>
              <select
                id="skill-filter"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                value={skillFilter}
                onChange={(e) => { setSkillFilter(e.target.value); setCurrentPage(1);}}
              >
                <option value="">All Skills</option>
                {availableSkills.map(skill => (
                  <option key={skill.id} value={skill.name}>{skill.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>

        {/* Freelancers Grid / Loading / Error / No Results */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-lg text-gray-700 font-semibold">Loading Freelancers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-red-700 mb-2">Oops! Something went wrong.</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : freelancers.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-10 rounded-lg text-center shadow-md">
            <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="mt-2 text-xl font-semibold text-yellow-800">No Freelancers Found</h3>
            <p className="text-yellow-600 mt-2">
              Try adjusting your search term or skill filter, or check back later.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {freelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id || freelancer.profile_slug} freelancer={freelancer} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 pt-6 border-t border-gray-200">
                <nav className="flex items-center space-x-2" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                      ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Previous page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {renderPaginationItems()}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                      ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Next page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Freelancers;