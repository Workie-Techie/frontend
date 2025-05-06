import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Imported useMemo
import { useAuth } from '../hooks/useAuth'; // Assuming this hook provides fetch/update profile functions
import { useSelector, useDispatch } from 'react-redux';
// Added icons for new/updated fields
import { FaEdit, FaSave, FaTimes, FaUser, FaMoneyBillWave, FaInfoCircle, FaTags, FaSpinner, FaCheckCircle, FaCertificate, FaBriefcase, FaBuilding, FaImage } from 'react-icons/fa';
import { setProfile as setProfileInStore } from '../store/authState'; // Import your Redux action to update the profile in the store

// --- Reusable Editable Section Component ---
// Manages its own local value state when editing and handles icon alignment
const EditableSection = ({ title, fieldName, initialValue, children, onEdit, isEditing, onSave, onCancel, isSaving, saveSuccess, error }) => {
  // Local state to hold the value while editing this section
  const [localValue, setLocalValue] = useState(initialValue);

  // Effect to sync local state if the initialValue prop changes (e.g., after parent fetch or save)
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  // Update local state as user types
  const handleLocalChange = (e) => {
    setLocalValue(e.target.value);
  };

  // Call parent's onSave with the field name and the local value
  const handleLocalSave = () => {
    onSave(fieldName, localValue);
  };

  // Call parent's onCancel and reset local state
  const handleLocalCancel = () => {
    setLocalValue(initialValue); // Revert local state
    onCancel(); // Call parent handler to exit editing mode
  };

    // Helper formatter for lists (skills, languages, etc.)
    // Handles arrays of strings or objects with a 'name' property
    const formatList = useCallback((list) => {
        if (Array.isArray(list)) {
          // If it's an array of objects (like Skill objects), map to names
          if (list.length > 0 && typeof list[0] === 'object' && list[0] !== null && 'name' in list[0]) {
            return list.map(item => item.name).join(', ');
          }
          // If it's an array of strings or other primitives, join them
          return list.join(', ');
        }
        // If it's already a string
        if (typeof list === 'string') {
            return list;
        }
        return null; // Or a default empty string
    }, []);


  // --- Helper to Render View or Edit Input ---
  // Renders either the display text or the input field based on `isEditing` prop
    // Removed useCallback wrapper - isEditing, localValue, etc. are available via closure
  const renderFieldContent = (type = 'text', icon = null, isTextArea = false, placeholder = '', displayFormatter = null) => {
    const IconComponent = icon;
    // Use localValue if editing, initialValue if not
    const currentValue = isEditing ? localValue : initialValue; // isEditing is correctly in scope here

    // Use the list formatter by default for array types unless a specific formatter is provided
    const effectiveDisplayFormatter = displayFormatter || (Array.isArray(currentValue) ? formatList : null); // formatList is also in scope


    // Wrap icon and content for alignment and consistent icon width
    return (
        <div className="flex items-start gap-2 w-full"> {/* Use items-start for top alignment */}
           {/* Give icon container a fixed width for alignment */}
           {IconComponent && <div className="shrink-0 w-5 text-gray-400 pt-1"><IconComponent size="1em" /></div>} {/* Adjusted padding/margin */}
           <div className='flex-grow'> {/* Allow content to take available space */}
             {isEditing ? (
                // --- EDIT MODE ---
                isTextArea ? (
                   <textarea
                     name={fieldName}
                     value={currentValue || ''}
                     onChange={handleLocalChange}
                     rows={isTextArea ? 5 : 1} // Default rows for textarea
                     className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 border-gray-300 transition"
                     placeholder={placeholder || `Enter your ${fieldName.replace('_', ' ')}`}
                     disabled={isSaving}
                 />
                ) : (
                  <input
                     type={type}
                     name={fieldName}
                     value={currentValue || ''}
                     onChange={handleLocalChange}
                     className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 border-gray-300 transition"
                     placeholder={placeholder || `Enter ${fieldName.replace('_', ' ')}`}
                     disabled={isSaving}
                 />
                )
             ) : (
                // --- VIEW MODE ---
                // Corrected ternary chain syntax
                <div className="text-gray-700 min-h-[1.5em]"> {/* Adjusted min-height */}
                  {effectiveDisplayFormatter
                        ? <span className="break-words">{effectiveDisplayFormatter(currentValue)}</span>
                        : (currentValue
                            ? <span className="break-words">{currentValue}</span>
                            : <span className="text-gray-400 italic">Not set</span>
                          )
                    }
                </div>
             )}
            </div>
        </div>
    );
  };


  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md sm:text-lg font-semibold text-gray-800">{title}</h3>
        {/* Edit Button: Only show if not editing this section */}
        {!isEditing && (
          <button
            onClick={() => onEdit(fieldName)} // Pass fieldName back up
            className="text-amber-600 hover:text-amber-800 p-1.5 rounded-full hover:bg-amber-100 transition duration-150 ease-in-out disabled:opacity-50"
            aria-label={`Edit ${title}`}
            disabled={isSaving} // Disable if any section is currently saving
          >
            <FaEdit size="1em" />
          </button>
        )}
        {/* Success Indicator: Show briefly after successful save */}
         {saveSuccess && (
           <FaCheckCircle className="text-green-500 animate-pulse" size="1.2em"/>
         )}
         {/* Error Indicator (Optional, error message also shown below) */}
         {error && !isEditing && ( // Show a small error icon in view mode if there's a saved error
           <FaTimes className="text-red-500" size="1.2em"/>
         )}
          {/* This error message is shown below the input */}
            </div>
            {/* Pass renderFieldContent helper AND relevant props to the children function */}
            <div className="text-sm sm:text-base">
              {typeof children === 'function' ? children(renderFieldContent, { isEditing, isSaving, localValue, error, saveSuccess }) : children}
            </div>
      {/* Action Buttons: Show only when editing this section */}
      {isEditing && (
        <div className="mt-4 flex justify-end items-center gap-3">
           {error && <p className="text-red-500 text-xs mr-auto">{error}</p>}
          <button
            onClick={handleLocalCancel} // Use local cancel handler
            type="button"
            className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleLocalSave} // Use local save handler
            type="button"
            className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[80px]"
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


// --- Main Profile Page Component ---
const EditProfile = () => {
  const { fetchUserProfile, updateUserProfile } = useAuth();
  // Get profile from Redux store if available, otherwise fetch
  const initialProfile = useSelector((state) => state.auth.profile);
  // Assuming user object has basic info like full_name, email, and role
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // profileData now primarily reflects the data from Redux (the saved state)
  const [profileData, setProfileData] = useState(initialProfile); // Initialize with Redux state
  // Which section is currently being edited? (e.g., 'title', 'bio', 'skills')
  const [editingSection, setEditingSection] = useState(null);
  // Loading/Saving state for API calls (Global for the whole form)
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialProfile); // True initially if no profile in store
  // Specific success state for visual feedback per section
  const [successes, setSuccesses] = useState({}); // { fieldName: true }
  // Error state per section
  const [errors, setErrors] = useState({}); // { fieldName: 'error message' }

    // State for handling the selected profile image file
    const [selectedProfileImageFile, setSelectedProfileImageFile] = useState(null);


  // Fetch profile data when component mounts if not already in Redux store
  useEffect(() => {
    const loadProfile = async () => {
      if (!initialProfile) {
        setIsLoading(true);
        setErrors({}); // Clear errors
        try {
          // fetchUserProfile likely fetches and dispatches to Redux store
          const data = await fetchUserProfile();
          setProfileData(data); // Initialize local state as well
        } catch (err) {
          console.error('Failed to load profile:', err);
          // Set a global error message for loading
          setErrors({ load: 'Failed to load profile data. Please try refreshing.' });
        } finally {
          setIsLoading(false);
        }
      } else {
        // If profile is already in store, initialize local state
        setProfileData(initialProfile);
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [fetchUserProfile, initialProfile]);


  // Sync local profileData state if the profile in Redux store changes (e.g., after a successful save)
  useEffect(() => {
    if (initialProfile) {
      setProfileData(initialProfile);
      // Clear selected image if profile data is synced after a non-image save
      // Check if currently saving the image before clearing
      if (!isSaving || editingSection !== 'profile_image') {
         setSelectedProfileImageFile(null);
      }
    }
  }, [initialProfile, isSaving, editingSection]);


  // --- Event Handlers ---

  // Set the section to be edited
  const handleEdit = (section) => {
    setEditingSection(section);
    setErrors({}); // Clear errors when starting a new edit
    setSuccesses({}); // Clear previous successes
     // For image, clear selected file state if starting edit again
     if (section === 'profile_image') {
        setSelectedProfileImageFile(null);
     }
  };

  // Cancel editing, revert changes for the current section (local state in EditableSection handles value revert)
  const handleCancel = useCallback(() => {
    setEditingSection(null);
    setErrors({});
    setSuccesses({});
    // Clear selected image file on cancel
    setSelectedProfileImageFile(null);
  }, []);


  // Calculate Profile Completion (Updated based on Django model fields)
  const calculateProfileCompletion = useCallback((profile) => {
    if (!profile) return 0;
    // Fields from the Django model to check for completion
    const fieldsToCheck = [
      { key: 'name', weight: 1 },
      { key: 'bio', weight: 1 },
      { key: 'title', weight: 1},
       { key: 'profile_image', weight: 1}, // Profile image is common
    ];

    const freelancerFields = [
        { key: 'skills', weight: 1, isArray: true },
        { key: 'hourly_rate', weight: 1 },
        { key: 'certifications', weight: 1 },
        { key: 'portfolio', weight: 1, isArray: true }, // Check if the array has items
    ];

    const clientFields = [
         { key: 'business_name', weight: 1 },
    ];


    let relevantFields = [...fieldsToCheck]; // Start with common and essential fields
    if (user?.role === 'freelancer') {
        relevantFields = [...relevantFields, ...freelancerFields];
    } else if (user?.role === 'client') {
         relevantFields = [...relevantFields, ...clientFields];
    }

    let filledWeight = 0;
    const totalWeight = relevantFields.reduce((sum, field) => sum + field.weight, 0);

    relevantFields.forEach(field => {
      const value = profile[field.key];
      if (field.isArray) {
        // For ManyToMany fields like skills/portfolio, check if the array/list is not empty
        if (Array.isArray(value) && value.length > 0) filledWeight += field.weight;
      } else {
        // For hourly_rate, 0 is considered filled if it's explicitly set and >= 0
        if (field.key === 'hourly_rate') {
            if (value !== null && value !== undefined && parseFloat(value) >= 0) filledWeight += field.weight;
        } else if (field.key === 'profile_image') {
            // For ImageField, check if a value exists (URL string from backend)
            if (value && typeof value === 'string') filledWeight += field.weight;
        }
         else if (value && value.toString().trim() !== '') {
            filledWeight += field.weight;
        }
      }
    });
    return totalWeight > 0 ? Math.round((filledWeight / totalWeight) * 100) : 0;
  }, [user]);


  // Recalculate completion when profileData or calculateProfileCompletion memo changes
  const profileCompletionPercentage = useMemo(() => calculateProfileCompletion(profileData), [profileData, calculateProfileCompletion]);


  // Save the specific field's new value (for text/number/textarea fields)
  const handleSave = async (fieldName, valueToUpdate) => {
    // Profile image and Portfolio need separate handlers due to FormData/complex structure
    if (fieldName === 'profile_image' || fieldName === 'portfolio') {
        console.warn(`Attempted to use generic handleSave for ${fieldName}. Use dedicated handler.`);
        // Potentially call the correct handler here if needed, or rely on the component
        // structure ensuring the right handler is passed to the Save button.
        return;
    }

    setIsSaving(true);
    setErrors({}); // Clear errors for this specific save attempt
    setSuccesses({}); // Clear previous successes

    // --- Data Formatting (Align with your Backend API expectations) ---
    let formattedValue = valueToUpdate;

    // Formatting for Skills (assuming backend expects an array of skill names)
    if (fieldName === 'skills') {
        formattedValue = typeof valueToUpdate === 'string'
            ? valueToUpdate.split(',').map(s => s.trim()).filter(Boolean) // Convert comma-separated string to array of names
            : Array.isArray(valueToUpdate) ? valueToUpdate.map(item =>
                 // If it's already an array (e.g., from initial data), ensure we send just names
                 typeof item === 'object' && item !== null && 'name' in item ? item.name : String(item)
               ) : [];
    }

    // Ensure hourly rate is a number
    if (fieldName === 'hourly_rate') {
        formattedValue = parseFloat(valueToUpdate) || 0;
    }

    // For TextField like certifications, CharField like title, bio, business_name, send the string value directly
    // No specific formatting needed beyond trimming if desired, which isn't done here globally.

    // Prepare data payload with only the field being updated
    const dataToSend = { [fieldName]: formattedValue };

    try {
        // Assuming updateUserProfile can handle partial updates and different data types
      const updatedProfileData = await updateUserProfile(dataToSend);

      // Update profile in Redux store (important!).
      dispatch(setProfileInStore(updatedProfileData));

      setEditingSection(null); // Exit editing mode for this section
      setSuccesses({ [fieldName]: true }); // Set success feedback for this section
      setTimeout(() => setSuccesses({}), 2000); // Clear success feedback after 2s

    } catch (err) {
      console.error(`Failed to update ${fieldName}:`, err);
      // Attempt to parse backend error messages if available
      const errorMessage = err.response?.data?.[fieldName]?.[0] || err.response?.data?.detail || `Failed to save ${fieldName}. Please try again.` ;
      setErrors({ [fieldName]: errorMessage }); // Set error for this specific field
    } finally {
      setIsSaving(false); // End global saving indicator
    }
  };


    // --- Dedicated Handler for Profile Image Save ---
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedProfileImageFile(file);
            // No need to update profileData yet, it reflects the saved state
            setErrors({ profile_image: null }); // Clear image-specific error on new selection
        }
    };

    const handleProfileImageSave = async () => {
        // If no new file is selected, but there's an existing image, allow saving (e.g., maybe other form data is saved with this)
        // If no new file is selected and no existing image, maybe show an error or just do nothing.
        // For now, require a selected file to trigger this specific handler.
        if (!selectedProfileImageFile) {
             // If there's already a saved image and no new file selected, consider it a successful "save" if nothing changed
             if (profileData.profile_image && typeof profileData.profile_image === 'string') {
                 setEditingSection(null);
                 setSuccesses({ profile_image: true });
                 setTimeout(() => setSuccesses({}), 2000);
                 return;
             }
             setErrors({ profile_image: 'Please select an image to upload.' });
             return; // Nothing to save
        }

        setIsSaving(true);
        setErrors({}); // Clear all errors initially, will set specific error on failure
        setSuccesses({});

        const formData = new FormData();
        formData.append('profile_image', selectedProfileImageFile); // Append the file

        try {
            // Assuming your updateUserProfile or a dedicated image upload API endpoint handles FormData
            // and returns the updated profile data with the new image URL
            const updatedProfileData = await updateUserProfile(formData); // API needs to accept FormData

            dispatch(setProfileInStore(updatedProfileData));
            setEditingSection(null);
            setSelectedProfileImageFile(null); // Clear selected file state after successful upload
            setSuccesses({ profile_image: true });
            setTimeout(() => setSuccesses({}), 2000);

        } catch (err) {
            console.error('Failed to update profile image:', err);
            const errorMessage = err.response?.data?.profile_image?.[0] || err.response?.data?.detail || 'Failed to save profile image. Please try again.';
            setErrors({ profile_image: errorMessage });
        } finally {
            setIsSaving(false);
        }
    };

    // Dedicated Handler for Profile Image Cancel
    const handleProfileImageCancel = () => {
        setSelectedProfileImageFile(null); // Clear selected file state
        setErrors({ profile_image: null }); // Clear image error
        handleCancel(); // Call parent cancel (clears editingSection etc.)
    };

     // --- Dedicated Handler for Portfolio Save (Placeholder) ---
     // NOTE: Implementing portfolio save correctly requires understanding your backend API
     // for ManyToMany relationships, especially with nested objects and file uploads.
     // This is a complex operation often needing a dedicated component/API endpoint.
     // This is a placeholder to show where the save logic would go.
     const handlePortfolioSave = async (fieldName, valueToUpdate) => {
         console.log("Attempting to save portfolio:", valueToUpdate);
         // valueToUpdate here would be the array of portfolio items managed locally

         setIsSaving(true);
         setErrors({});
         setSuccesses({});

         // TODO: Implement API call to save portfolio items.
         // This will likely involve sending a structured array of items,
         // potentially using FormData if images are being uploaded for new items.
         // Example (conceptual):
         /*
         const dataToSend = {
            portfolio: valueToUpdate.map(item => ({
                id: item.id, // Include ID for existing items
                description: item.description,
                // For new items with files, you might need to handle FormData
                // or upload images first and send back IDs/URLs
                image: item.file ? item.file : item.image // item.file is the new File object
            }))
         };

         try {
             const updatedProfileData = await updateUserProfile(dataToSend); // API needs to support this structure
             dispatch(setProfileInStore(updatedProfileData));
             setEditingSection(null);
             setSuccesses({ portfolio: true });
             setTimeout(() => setSuccesses({}), 2000);
         } catch (err) {
             console.error('Failed to update portfolio:', err);
             const errorMessage = err.response?.data?.portfolio?.[0] || err.response?.data?.detail || 'Failed to save portfolio. Please try again.';
             setErrors({ portfolio: errorMessage });
         } finally {
             setIsSaving(false);
         }
         */

         // --- Placeholder Simulation ---
         console.warn("Portfolio save not fully implemented. Simulating success/failure.");
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

          // Simulate success
          setEditingSection(null);
          setSuccesses({ portfolio: true });
          setTimeout(() => setSuccesses({}), 2000);
          setIsSaving(false);

          // Simulate failure (uncomment to test)
          /*
           setErrors({ portfolio: "Failed to save portfolio items." });
           setIsSaving(false);
          */
     };


  // --- Formatters for Display ---
  const formatRate = (rate) => rate !== null && rate !== undefined && rate !== '' ? `$${parseFloat(rate).toFixed(2)} / hr` : null;
  // formatList is now within EditableSection


  // --- Render Logic ---
  if (isLoading) return <div className="flex justify-center items-center h-60"><FaSpinner className="animate-spin text-amber-500 text-4xl" /></div>;
  // Show general load error if profileData is null and there's a load error
  if (!profileData && errors.load) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-md">{errors.load}</div>;
  if (!profileData) return <div className="text-center p-10 text-gray-500">Profile data not available.</div>;


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      {/* Profile Header (Example - Adapt as needed) */}
      <div className="mb-8 p-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-lg text-white">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-amber-500 mb-4 md:mb-0 md:mr-6 ring-4 ring-amber-300 shrink-0">
            {/* Display Profile Image in Header */}
            {profileData.profile_image ? (
              <img
                 // Use selected file for preview, otherwise use saved image URL
                src={selectedProfileImageFile ? URL.createObjectURL(selectedProfileImageFile) : (typeof profileData.profile_image === 'string' ? profileData.profile_image : null)}
                alt={profileData.name || 'Profile'}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FaUser className="text-3xl" />
            )}
          </div>
          <div>
            {/* Display Name and Title from profileData, fallback to user data */}
            <h1 className="text-3xl font-bold">{profileData.name || user?.full_name || 'Your Name'}</h1>
            <p className="text-amber-100 text-sm">{profileData.title || user?.email}</p> {/* Assuming title is a good place for a subtitle/email fallback */}
            {user?.role && (
              <span className="mt-2 inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                {user.role}
              </span>
            )}
          </div>
        </div>
        {/* Optional: Display Business Name in header if client */}
        {user?.role === 'client' && profileData.business_name && (
          <p className="text-amber-100 text-sm mt-2">Business: {profileData.business_name}</p>
        )}
      </div>

      <div className="mb-8 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Profile Completion</h2>
          <span className="text-sm font-medium text-amber-600">{profileCompletionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-amber-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${profileCompletionPercentage}%` }}
          ></div>
        </div>
        {profileCompletionPercentage < 100 && (
          <p className="text-xs text-gray-500 mt-2">Complete your profile to increase visibility to potential clients.</p>
        )}
      </div>

      {/* Grid for Editable Sections */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6">

            {/* Name - Assumed editable based on model */}
            <EditableSection
                title="Full Name"
                fieldName="name"
                initialValue={profileData.name}
                onEdit={handleEdit}
                isEditing={editingSection === 'name'}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving && editingSection === 'name'}
                saveSuccess={!!successes.name}
                error={errors.name}
            >
                {/* Pass renderFieldContent helper to children render prop */}
                {(render) => render('text', FaUser, false, 'Your full name')}
            </EditableSection>

         {/* Title */}
         <EditableSection
            title="Title / Headline"
            fieldName="title"
            initialValue={profileData.title}
            onEdit={handleEdit}
            isEditing={editingSection === 'title'}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving && editingSection === 'title'}
            saveSuccess={!!successes.title}
            error={errors.title}
          >
            {(render) => render('text', FaUser, false, 'e.g. Senior Frontend Developer')}
         </EditableSection>

         {/* Bio */}
         <EditableSection
            title="Bio"
            fieldName="bio"
            initialValue={profileData.bio}
            onEdit={handleEdit}
            isEditing={editingSection === 'bio'}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving && editingSection === 'bio'}
            saveSuccess={!!successes.bio}
            error={errors.bio}
          >
            {(render) => render('text', FaInfoCircle, true, 'Tell clients about your expertise, experience, and what makes you stand out...')}
         </EditableSection>

         {/* Profile Image (Common Field) */}
          <EditableSection
            title="Profile Image"
            fieldName="profile_image"
            // Use selected file for preview, otherwise use saved image data
            initialValue={selectedProfileImageFile || profileData.profile_image}
            onEdit={handleEdit}
            isEditing={editingSection === 'profile_image'}
            onSave={handleProfileImageSave} // Use dedicated save handler
            onCancel={handleProfileImageCancel} // Use dedicated cancel handler
            isSaving={isSaving && editingSection === 'profile_image'}
            saveSuccess={!!successes.profile_image}
            error={errors.profile_image}
        >
             {/* Custom rendering for file input and preview */}
             {/* Accept render helper AND relevant state/props */}
            {(render, { isEditing, isSaving, error }) => {
                // isEditing, isSaving, error are now available in this scope

                // Determine the image source URL
                const displayImageUrl = selectedProfileImageFile
                    ? URL.createObjectURL(selectedProfileImageFile) // Show preview of new file
                    : (typeof profileData.profile_image === 'string' ? profileData.profile_image : null); // Show existing image URL

                return (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500">
                            {displayImageUrl ? (
                                 <img src={displayImageUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                            ) : (
                                 <FaUser size="2em"/>
                            )}
                        </div>
                        {/* Use isEditing from the render prop arguments */}
                        {isEditing && (
                            <div className="flex-grow w-full">
                                 <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileImageChange} // handleProfileImageChange from EditProfile scope
                                    className="w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-amber-50 file:text-amber-700
                                        hover:file:bg-amber-100"
                                     disabled={isSaving} // isSaving from the render prop arguments
                                  />
                                  {selectedProfileImageFile && <p className="text-xs text-gray-500 mt-1">Selected: {selectedProfileImageFile.name}</p>} // selectedProfileImageFile from EditProfile scope
                            </div>
                        )}
                         {/* Also display error specific to this section if needed in the custom UI */}
                         {/* Use error from the render prop arguments */}
                         {error && isEditing && ( // Show error below input if editing
                             <p className="text-red-500 text-xs mt-2">{error}</p>
                         )}
                    </div>
                );
            }}
         </EditableSection>


         {/* Business Name (Client Only) */}
         {user?.role === 'client' && (
            <EditableSection
                title="Business Name"
                fieldName="business_name"
                initialValue={profileData.business_name}
                onEdit={handleEdit}
                isEditing={editingSection === 'business_name'}
                onSave={handleSave} // Uses generic handleSave as it's a CharField
                onCancel={handleCancel}
                isSaving={isSaving && editingSection === 'business_name'}
                saveSuccess={!!successes.business_name}
                error={errors.business_name}
            >
                {(render) => render('text', FaBuilding, false, 'Your business name')}
            </EditableSection>
         )}


         {user?.role === 'freelancer' && (
             <> {/* Use Fragment for grouping */}
                {/* Hourly Rate */}
                <EditableSection
                    title="Hourly Rate"
                    fieldName="hourly_rate"
                    initialValue={profileData.hourly_rate}
                    onEdit={handleEdit}
                    isEditing={editingSection === 'hourly_rate'}
                    onSave={handleSave} // Uses generic handleSave
                    onCancel={handleCancel}
                    isSaving={isSaving && editingSection === 'hourly_rate'}
                    saveSuccess={!!successes.hourly_rate}
                    error={errors.hourly_rate}
                >
                    {(render) => render('number', FaMoneyBillWave, false, 'e.g. 50', formatRate)}
                </EditableSection>

                {/* Skills */}
                <EditableSection
                    title="Skills"
                    fieldName="skills"
                    initialValue={profileData.skills} // Pass the array (might be objects or strings)
                    onEdit={handleEdit}
                    isEditing={editingSection === 'skills'}
                    onSave={handleSave} // Uses generic handleSave (formats to array of names)
                    onCancel={handleCancel}
                    isSaving={isSaving && editingSection === 'skills'}
                    saveSuccess={!!successes.skills}
                    error={errors.skills}
                >
                    {/* Pass the render function as children and use it inside */}
                     {/* Accept render helper AND relevant state/props */}
                    {(render, { isEditing, error }) => ( // isEditing and error might be used here
                        <>
                            {/* renderFieldContent uses formatList internally for display mode */}
                            {render('text', FaTags, false, 'e.g. React, Node.js, Figma (Comma-separated)')}
                            {/* Use isEditing from render prop arguments */}
                            {isEditing && <p className="text-xs text-gray-500 mt-1">Enter skills separated by commas.</p>}
                             {/* Use error from render prop arguments if needed here */}
                            {/* {error && isEditing && <p className="text-red-500 text-xs mt-1">{error}</p>} */}
                        </>
                    )}
                </EditableSection>

                 {/* Certifications */}
                <EditableSection
                    title="Certifications"
                    fieldName="certifications"
                    initialValue={profileData.certifications}
                    onEdit={handleEdit}
                    isEditing={editingSection === 'certifications'}
                    onSave={handleSave} // Uses generic handleSave as it's a TextField
                    onCancel={handleCancel}
                    isSaving={isSaving && editingSection === 'certifications'}
                    saveSuccess={!!successes.certifications}
                    error={errors.certifications}
                >
                    {(render) => render('text', FaCertificate, true, 'List any relevant certifications...')}
                </EditableSection>


                {/* Portfolio (Requires custom handling) */}
                 <EditableSection
                    title="Portfolio"
                    fieldName="portfolio"
                    initialValue={profileData.portfolio} // This will be an array of PortfolioItem objects
                    onEdit={handleEdit}
                    isEditing={editingSection === 'portfolio'}
                    onSave={handlePortfolioSave} // Use dedicated handler (Placeholder)
                    onCancel={handleCancel} // Standard cancel should be okay
                    isSaving={isSaving && editingSection === 'portfolio'}
                    saveSuccess={!!successes.portfolio}
                    error={errors.portfolio}
                >
                    {/* This section needs custom rendering logic for file uploads and displaying items */}
                    {/* Accept render helper AND relevant state/props */}
                    {(render, { isEditing, error }) => {
                        // isEditing and error are now available in this scope
                        // profileData is still available from EditProfile scope

                        // Display existing portfolio items
                        const portfolioItems = Array.isArray(profileData.portfolio) ? profileData.portfolio : [];

                        return (
                            <div>
                                {portfolioItems.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {portfolioItems.map(item => (
                                            // Assuming portfolio items have an 'id' and 'image' URL
                                            <div key={item.id || item.image} className="relative group aspect-square overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                                                {/* Display image */}
                                                {item.image ? (
                                                    <img src={item.image} alt={item.description || `Portfolio Item ${item.id}`} className="object-cover w-full h-full" />
                                                ) : (
                                                    <FaBriefcase className="text-gray-400 text-2xl" />
                                                )}
                                                {/* Optional: Overlay for description or actions on hover */}
                                                {item.description && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <p className="text-white text-xs text-center line-clamp-3">{item.description}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 italic text-sm">No portfolio items added.</span>
                                )}

                                {/* Placeholder for adding new items */}
                                {/* Use isEditing from render prop arguments */}
                                {isEditing && (
                                    <div className="mt-4 border-t pt-4">
                                        <p className="text-gray-500 italic text-sm">TODO: Implement adding new portfolio items (image upload + description)</p>
                                         {/* Example: <PortfolioItemUploader onAddItem={handleAddItemToPortfolio} /> */}
                                    </div>
                                )}
                                {/* Use error from render prop arguments if needed here */}
                                {error && isEditing && ( // Show error below input if editing
                                     <p className="text-red-500 text-xs mt-2">{error}</p>
                                )}
                            </div>
                        );
                    }}
                 </EditableSection>
             </>
         )}

      </div>
    </div>
  );
};

export default EditProfile;