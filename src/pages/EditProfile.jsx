import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaEdit, FaSave, FaUser, FaMoneyBillWave, 
  FaInfoCircle, FaSpinner, FaCheckCircle, 
  FaGraduationCap, FaBriefcase, FaImage, 
  FaBuilding, FaCode
} from 'react-icons/fa';
import { setProfile as setProfileInStore } from '../store/authState';

// --- Reusable Editable Section Component ---
const EditableSection = ({ title, fieldName, children, onEdit, isEditing, onSave, onCancel, isSaving, saveSuccess, error }) => {
  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border transition-all duration-300 ${isEditing ? 'border-amber-300 shadow-md' : 'border-gray-100'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {title}
          {saveSuccess && (
            <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <FaCheckCircle className="mr-1" size="0.75em" />
              Updated
            </span>
          )}
        </h3>
        {/* Edit Button: Only show if not editing this section */}
        {!isEditing && (
          <button
            onClick={() => onEdit(fieldName)}
            className="text-amber-600 hover:text-amber-800 p-2 rounded-full hover:bg-amber-50 transition duration-150 ease-in-out disabled:opacity-50"
            aria-label={`Edit ${title}`}
            disabled={isSaving}
          >
            <FaEdit size="1em" />
          </button>
        )}
      </div>
      <div className="text-base">{children}</div>
      {/* Action Buttons: Show only when editing this section */}
      {isEditing && (
        <div className="mt-5 flex justify-end items-center gap-3">
          {error && <p className="text-red-500 text-xs mr-auto">{error}</p>}
          <button
            onClick={onCancel}
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[80px]"
            disabled={isSaving}
          >
            {isSaving ? <FaSpinner className="animate-spin" size="1em" /> : <FaSave size="1em" />}
            <span>Save</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Portfolio Item Component
const PortfolioItem = ({ item, onRemove, isSaving }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
      {item.image && (
        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
          <img 
            src={typeof item.image === 'string' ? item.image : URL.createObjectURL(item.image)} 
            alt="Portfolio" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <p className="text-sm text-gray-700">{item.description}</p>
      {onRemove && (
        <button 
          onClick={() => onRemove(item.id)} 
          className="text-xs text-red-500 hover:text-red-700 self-end mt-1"
          disabled={isSaving}
        >
          Remove
        </button>
      )}
    </div>
  );
};

// Portfolio Upload Component
const PortfolioUploadComponent = ({ portfolioItems, setPortfolioItems, isSaving }) => {
  const [newItem, setNewItem] = useState({ image: null, description: '' });
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewItem(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = (e) => {
    setNewItem(prev => ({ ...prev, description: e.target.value }));
  };

  const handleAddItem = () => {
    if (newItem.image) {
      // For local state, generate a temporary ID
      const tempId = Date.now().toString();
      const itemToAdd = { 
        ...newItem, 
        id: tempId, 
        // Keep the file object for later upload
      };
      
      setPortfolioItems(prev => [...prev, itemToAdd]);
      setNewItem({ image: null, description: '' });
      setPreviewUrl(null);
    }
  };

  const handleRemoveItem = (itemId) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {portfolioItems.map((item) => (
          <PortfolioItem 
            key={item.id} 
            item={item} 
            onRemove={handleRemoveItem}
            isSaving={isSaving} 
          />
        ))}
      </div>
      
      <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <h4 className="font-medium text-gray-700 mb-3">Add New Portfolio Item</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              disabled={isSaving}
            />
            {previewUrl && (
              <div className="mt-2 aspect-video w-full max-w-xs bg-gray-100 rounded-md overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newItem.description}
              onChange={handleDescriptionChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              placeholder="Describe this portfolio item..."
              disabled={isSaving}
            />
          </div>
          
          <button
            onClick={handleAddItem}
            disabled={!newItem.image || isSaving}
            className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Profile Page Component ---
const EditProfile = () => {
  const { fetchUserProfile, updateUserProfile } = useAuth();
  const initialProfile = useSelector((state) => state.auth.profile);
  const dispatch = useDispatch();

  // Local state to hold potentially modified profile data during edits
  const [profileData, setProfileData] = useState(null);
  // Which section is currently being edited?
  const [editingSection, setEditingSection] = useState(null);
  // Loading/Saving state for API calls
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialProfile);
  // Specific success state for visual feedback
  const [saveSuccessSection, setSaveSuccessSection] = useState(null);
  // Error state for API calls
  const [error, setError] = useState(null);
  // Skills input state
  const [skillInput, setSkillInput] = useState('');
  // Portfolio state (for editing)
  const [portfolioItems, setPortfolioItems] = useState([]);

  // Fetch profile data when component mounts if not already in Redux store
  useEffect(() => {
    const loadProfile = async () => {
      if (!initialProfile) {
        setIsLoading(true);
        setError(null);
        try {
          const data = await fetchUserProfile();
          setProfileData(data);
          
          // Initialize portfolio items if available
          if (data.portfolio) {
            setPortfolioItems(data.portfolio);
          }
        } catch (err) {
          console.error('Failed to load profile:', err);
          setError('Failed to load profile data. Please try refreshing.');
        } finally {
          setIsLoading(false);
        }
      } else {
        // If profile is already in store, initialize local state
        setProfileData(initialProfile);
        
        // Initialize portfolio items if available
        if (initialProfile.portfolio) {
          setPortfolioItems(initialProfile.portfolio);
        }
        
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [fetchUserProfile, initialProfile]);

  // Sync local editing state if the profile in Redux store changes
  useEffect(() => {
    if (initialProfile) {
      setProfileData(initialProfile);
      
      // Update portfolio items if available
      if (initialProfile.portfolio) {
        setPortfolioItems(initialProfile.portfolio);
      }
    }
  }, [initialProfile]);

  // --- Event Handlers ---

  // Set the section to be edited
  const handleEdit = (section) => {
    setEditingSection(section);
    setError(null);
    setSaveSuccessSection(null);
    
    // Initialize skill input if editing skills
    if (section === 'skills' && profileData.skills) {
      // Convert array of skill objects to comma-separated string of names
      const skillsString = Array.isArray(profileData.skills) 
        ? profileData.skills.map(skill => skill.name).join(', ')
        : '';
      setSkillInput(skillsString);
    }
  };

  // Cancel editing, revert changes for the current section
  const handleCancel = () => {
    setProfileData(initialProfile);
    setEditingSection(null);
    setError(null);
    setSaveSuccessSection(null);
    
    // Reset portfolio items to match the store state
    if (initialProfile.portfolio) {
      setPortfolioItems(initialProfile.portfolio);
    }
  };

  // Handle skill input changes
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  // Save the currently edited section
  const handleSave = async () => {
    if (!editingSection) return;

    setIsSaving(true);
    setError(null);
    setSaveSuccessSection(null);

    const fieldToUpdate = editingSection;
    let dataToSend = {};

    try {
      // Special handling for different fields
      if (fieldToUpdate === 'skills') {
        // Convert comma-separated string to array of skill objects for API
        const skillsArray = skillInput
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .map(name => ({ name }));
        
        dataToSend = { skills: skillsArray };
      } 
      else if (fieldToUpdate === 'portfolio') {
        // Handle portfolio items with actual file uploads
        const formData = new FormData();
        
        // Append each portfolio item
        portfolioItems.forEach((item, index) => {
          if (item.image instanceof File) {
            formData.append(`portfolio_items[${index}][image]`, item.image);
          }
          formData.append(`portfolio_items[${index}][description]`, item.description);
          
          // If item has an ID (existing item), include it
          if (item.id && !item.id.toString().startsWith('temp_')) {
            formData.append(`portfolio_items[${index}][id]`, item.id);
          }
        });
        
        // Use a different API endpoint/method for handling file uploads
        const updatedProfileData = await updateUserProfile(formData, true);
        dispatch(setProfileInStore(updatedProfileData));
      }
      else {
        // Regular field update
        dataToSend = { [fieldToUpdate]: profileData[fieldToUpdate] };
        
        const updatedProfileData = await updateUserProfile(dataToSend);
        dispatch(setProfileInStore(updatedProfileData));
      }

      setEditingSection(null);
      setSaveSuccessSection(fieldToUpdate);
      setTimeout(() => setSaveSuccessSection(null), 2000);
    } catch (err) {
      console.error(`Failed to update ${fieldToUpdate}:`, err);
      const errorMessage = err.response?.data?.[fieldToUpdate]?.[0] || 
                           err.response?.data?.detail || 
                           `Failed to save ${fieldToUpdate}. Please try again.`;
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Update local state as user types in the input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Helper to Render View or Edit Input ---
  const renderFieldContent = (fieldName, type = 'text', icon = null, isTextArea = false, placeholder = '', displayFormatter = null) => {
    const isEditing = editingSection === fieldName;
    const IconComponent = icon;
    let currentValue = profileData?.[fieldName];

    // Special handling for skills field display
    if (fieldName === 'skills' && Array.isArray(currentValue)) {
      if (isEditing) {
        currentValue = skillInput;
      } else {
        // Format skills for display
        currentValue = currentValue.map(skill => skill.name).join(', ');
      }
    }

    if (isEditing) {
      // --- EDIT MODE ---
      return (
        <div className="flex items-start gap-3 w-full">
          {IconComponent && <IconComponent className="text-amber-500 mt-2.5" size="1.25em" />}
          <div className="w-full">
            {isTextArea ? (
              <textarea
                name={fieldName}
                value={currentValue || ''}
                onChange={fieldName === 'skills' ? handleSkillInputChange : handleChange}
                rows={5}
                className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 border-gray-300 transition"
                placeholder={placeholder || `Enter your ${fieldName.replace('_', ' ')}`}
                disabled={isSaving}
              />
            ) : (
              <input
                type={type}
                name={fieldName}
                value={currentValue || ''}
                onChange={fieldName === 'skills' ? handleSkillInputChange : handleChange}
                className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 border-gray-300 transition"
                placeholder={placeholder || `Enter ${fieldName.replace('_', ' ')}`}
                disabled={isSaving}
              />
            )}
          </div>
        </div>
      );
    } else {
      // --- VIEW MODE ---
      let displayValue = currentValue;
      
      // Use formatter if provided
      if (displayFormatter) {
        displayValue = displayFormatter(currentValue);
      }

      return (
        <div className="flex items-start gap-3 text-gray-700 min-h-[2.5rem] py-1"> 
          {IconComponent && <IconComponent className="text-amber-500" size="1.25em" />}
          <div className="flex-1">
            {displayValue ? (
              <span className="break-words">{displayValue}</span>
            ) : (
              <span className="text-gray-400 italic">Not set</span>
            )}
          </div>
        </div>
      );
    }
  };

  // --- Formatters for Display ---
  const formatRate = (rate) => rate ? `$${parseFloat(rate).toFixed(2)} / hr` : null;

  // --- Render Logic ---
  if (isLoading) return (
    <div className="flex justify-center items-center h-60">
      <div className="flex flex-col items-center">
        <FaSpinner className="animate-spin text-amber-500 text-4xl mb-4" />
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    </div>
  );
  
  if (error && !profileData) return (
    <div className="p-10 mx-auto max-w-2xl">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <FaInfoCircle className="text-red-500 text-3xl mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Unable to Load Profile</h3>
        <p className="text-red-600">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Retry
        </button>
      </div>
    </div>
  );
  
  if (!profileData) return (
    <div className="text-center p-10 text-gray-500">Profile data not available.</div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="mb-8 p-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-md text-white">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-amber-500 mb-4 md:mb-0 md:mr-6">
            {profileData.profile_image ? (
              <img 
                src={profileData.profile_image} 
                alt={profileData.name || 'Profile'} 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FaUser className="text-3xl" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profileData.name || 'Complete Your Profile'}</h1>
            <p className="text-amber-100">{profileData.user?.email}</p>
            <div className="mt-2 flex items-center">
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                Freelancer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Progress */}
      <div className="mb-8 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Profile Completion</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-amber-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${calculateProfileCompletion(profileData)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Complete your profile to increase visibility to potential clients.</p>
      </div>

      {/* Grid for Editable Sections */}
      <div className="grid grid-cols-1 gap-6">
        {/* Name */}
        <EditableSection 
          title="Full Name" 
          fieldName="name" 
          onEdit={handleEdit} 
          isEditing={editingSection === 'name'} 
          onSave={handleSave} 
          onCancel={handleCancel} 
          isSaving={isSaving && editingSection === 'name'} 
          saveSuccess={saveSuccessSection === 'name'} 
          error={error && editingSection === 'name'}
        >
          {renderFieldContent('name', 'text', FaUser, false, 'Your full name')}
        </EditableSection>

        {/* Bio */}
        <EditableSection 
          title="Professional Bio" 
          fieldName="bio" 
          onEdit={handleEdit} 
          isEditing={editingSection === 'bio'} 
          onSave={handleSave} 
          onCancel={handleCancel} 
          isSaving={isSaving && editingSection === 'bio'} 
          saveSuccess={saveSuccessSection === 'bio'} 
          error={error && editingSection === 'bio'}
        >
          {renderFieldContent('bio', 'text', FaInfoCircle, true, 'Tell clients about your expertise, experience, and what makes you stand out...')}
        </EditableSection>

        {/* Hourly Rate */}
        <EditableSection 
          title="Hourly Rate (USD)" 
          fieldName="hourly_rate" 
          onEdit={handleEdit} 
          isEditing={editingSection === 'hourly_rate'} 
          onSave={handleSave} 
          onCancel={handleCancel} 
          isSaving={isSaving && editingSection === 'hourly_rate'} 
          saveSuccess={saveSuccessSection === 'hourly_rate'} 
          error={error && editingSection === 'hourly_rate'}
        >
          {renderFieldContent('hourly_rate', 'number', FaMoneyBillWave, false, 'e.g. 20', formatRate)}
        </EditableSection>

        {/* Skills */}
        <EditableSection 
          title="Skills" 
          fieldName="skills" 
          onEdit={handleEdit} 
          isEditing={editingSection === 'skills'} 
          onSave={handleSave} 
          onCancel={handleCancel} 
          isSaving={isSaving && editingSection === 'skills'} 
          saveSuccess={saveSuccessSection === 'skills'} 
          error={error && editingSection === 'skills'}
        >
          {renderFieldContent('skills', 'text', FaCode, false, 'e.g. React, Python, UI/UX Design (Comma-separated)')}
          {editingSection === 'skills' && 
            <p className="text-xs text-gray-500 mt-2 ml-9">Enter skills separated by commas (e.g. JavaScript, Python, React)</p>
          }
        </EditableSection>

        {/* Certifications */}
        <EditableSection 
          title="Certifications" 
          fieldName="certifications" 
          onEdit={handleEdit} 
          isEditing={editingSection === 'certifications'} 
          onSave={handleSave} 
          onCancel={handleCancel} 
          isSaving={isSaving && editingSection === 'certifications'} 
          saveSuccess={saveSuccessSection === 'certifications'} 
          error={error && editingSection === 'certifications'}
        >
          {renderFieldContent('certifications', 'text', FaGraduationCap, true, 'List your professional certifications...')}
        </EditableSection>

        {/* Business Name (Client-only) */}
        <EditableSection 
          title="Business Name" 
          fieldName="business_name" 
          onEdit={handleEdit} 
          isEditing={editingSection === 'business_name'} 
          onSave={handleSave} 
          onCancel={handleCancel} 
          isSaving={isSaving && editingSection === 'business_name'} 
          saveSuccess={saveSuccessSection === 'business_name'} 
          error={error && editingSection === 'business_name'}
        >
          {renderFieldContent('business_name', 'text', FaBuilding, false, 'Your company or business name')}
        </EditableSection>

        {/* Portfolio */}
        <EditableSection 
          title="Portfolio" 
          fieldName="portfolio" 
          onEdit={handleEdit} 
          isEditing={editingSection === 'portfolio'} 
          onSave={handleSave} 
          onCancel={handleCancel} 
          isSaving={isSaving && editingSection === 'portfolio'} 
          saveSuccess={saveSuccessSection === 'portfolio'} 
          error={error && editingSection === 'portfolio'}
        >
          {editingSection === 'portfolio' ? (
            <PortfolioUploadComponent 
              portfolioItems={portfolioItems}
              setPortfolioItems={setPortfolioItems}
              isSaving={isSaving}
            />
          ) : (
            <div className="flex items-start gap-3">
              <FaBriefcase className="text-amber-500" size="1.25em" />
              <div className="flex-1">
                {portfolioItems && portfolioItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {portfolioItems.map((item) => (
                      <PortfolioItem key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No portfolio items added yet</span>
                )}
              </div>
            </div>
          )}
        </EditableSection>

        {/* Profile Image */}
        <EditableSection 
          title="Profile Picture" 
          fieldName="profile_image" 
          onEdit={handleEdit} 
          isEditing={editingSection === 'profile_image'} 
          onSave={handleSave} 
          onCancel={handleCancel} 
          isSaving={isSaving && editingSection === 'profile_image'} 
          saveSuccess={saveSuccessSection === 'profile_image'} 
          error={error && editingSection === 'profile_image'}
        >
          {editingSection === 'profile_image' ? (
            <div className="flex items-start gap-3">
              <FaImage className="text-amber-500 mt-2" size="1.25em" />
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  name="profile_image"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfileData(prev => ({ ...prev, profile_image: e.target.files[0] }));
                    }
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  disabled={isSaving}
                />
                {profileData.profile_image && (
                  <div className="mt-3 flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden mr-3">
                      <img 
                        src={typeof profileData.profile_image === 'string' 
                          ? profileData.profile_image 
                          : URL.createObjectURL(profileData.profile_image)} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-500">Preview</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <FaImage className="text-amber-500" size="1.25em" />
              {profileData.profile_image ? (
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
                    <img 
                      src={profileData.profile_image} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 italic">No profile picture set</span>
              )}
            </div>
          )}
        </EditableSection>
      </div>
    </div>
  );
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  
  const fields = [
    'name',
    'bio',
    'skills',
    'hourly_rate',
    'profile_image',
    'certifications'
  ];
  
  let filledFields = 0;
  
  fields.forEach(field => {
    if (field === 'skills') {
      if (profile[field] && Array.isArray(profile[field]) && profile[field].length > 0) {
        filledFields++;
      }
    } else if (field === 'portfolio') {
      if (profile[field] && Array.isArray(profile[field]) && profile[field].length > 0) {
        filledFields++;
      }
    } else if (profile[field] && profile[field] !== '') {
      filledFields++;
    }
  });
  
  return Math.round((filledFields / fields.length) * 100);
};

export default EditProfile;