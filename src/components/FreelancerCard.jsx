import React from 'react';
import { Link } from 'react-router-dom';

const FreelancerCard = ({ freelancer }) => {
  return (
    <Link 
      to={`/${freelancer.profile_slug}`} 
      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-14 w-14 rounded-full flex items-center justify-center overflow-hidden">
              {freelancer.profile_image ? (
                <img 
                  src={freelancer.profile_image} 
                  alt={freelancer.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-500">
                    {freelancer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {freelancer.name}
            </h3>
            {freelancer.title && (
              <p className="text-sm text-gray-600 truncate">
                {freelancer.title}
              </p>
            )}
          </div>
          
          {freelancer.hourly_rate && (
            <div className="flex-shrink-0 text-blue-600 font-semibold">
              ${freelancer.hourly_rate}/hr
            </div>
          )}
        </div>
        
        {freelancer.skills && freelancer.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {freelancer.skills.slice(0, 3).map((skill) => (
              <span 
                key={skill.id}
                className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {skill.name}
              </span>
            ))}
            {freelancer.skills.length > 3 && (
              <span className="text-xs text-gray-500 px-1">
                +{freelancer.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default FreelancerCard;