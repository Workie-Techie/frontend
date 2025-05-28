import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import profileService from '../services/profileService';

const SkillSelector = ({ 
  selectedSkills, 
  onChange, 
  maxSkills = 5,
  error
}) => {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch available skills from backend using profileService
  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      try {
        const skills = await profileService.getSkills();
        setAvailableSkills(skills);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSkills();
  }, []);
  
  // Handle adding a skill
  const handleAddSkill = (skill) => {
    if (selectedSkills.length < maxSkills) {
      // Check if skill is already selected
      if (!selectedSkills.some(s => s.id === skill.id)) {
        onChange([...selectedSkills, skill]);
      }
    }
  };
  
  // Handle removing a skill
  const handleRemoveSkill = (skillId) => {
    onChange(selectedSkills.filter(skill => skill.id !== skillId));
  };
  
  // Filter skills based on search term
  const filteredSkills = availableSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSkills.some(s => s.id === skill.id)
  );
  
  return (
    <div className="space-y-3">
      {/* Selected skills */}
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map(skill => (
          <div 
            key={skill.id} 
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm"
          >
            <span>{skill.name}</span>
            <button 
              onClick={() => handleRemoveSkill(skill.id)}
              className="ml-2 text-blue-600 hover:text-blue-800"
              aria-label={`Remove ${skill.name}`}
            >
              <FaTimes size={12} />
            </button>
          </div>
        ))}
        
        {selectedSkills.length === 0 && (
          <div className="text-gray-400 text-sm">No skills selected</div>
        )}
      </div>
      
      {/* Skills selection */}
      <div>
        <input
          type="text"
          className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Search for a skill..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={selectedSkills.length >= maxSkills}
        />
        
        {selectedSkills.length >= maxSkills && (
          <p className="text-xs text-amber-600 mt-1">
            Maximum of {maxSkills} skills allowed
          </p>
        )}
      </div>
      
      {/* Available skills */}
      {searchTerm && (
        <div className="border rounded max-h-40 overflow-y-auto">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">Loading skills...</div>
          ) : filteredSkills.length > 0 ? (
            <div className="divide-y">
              {filteredSkills.map(skill => (
                <p
                  key={skill.id}
                  className="w-full text-center cursor-pointer px-3 py-2 hover:bg-gray-100 transition-colors"
                  onClick={() => handleAddSkill(skill)}
                  disabled={selectedSkills.length >= maxSkills}
                >
                  {skill.name}
                </p>
              ))}
            </div>
          ) : (
            <div className="p-2 text-center text-gray-500">
              No matching skills found
            </div>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        Select up to {maxSkills} skills that best represent your expertise.
      </div>
    </div>
  );
};

export default SkillSelector;