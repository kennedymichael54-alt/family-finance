// ============================================================================
// PROSPERNEST - SIDE HUSTLE INTEGRATION GUIDE
// How to integrate the dynamic Command Center into your App.jsx
// ============================================================================

/*
 * OVERVIEW OF CHANGES:
 * 
 * 1. Import the new components
 * 2. Add sideHustle to user state
 * 3. Show WelcomeSideHustleModal for new users
 * 4. Add SideHustleDropdown to ManageAccountModal
 * 5. Update SalesTracker to use dynamic Command Center
 * 6. Save/load sideHustle from localStorage
 */

// ============================================================================
// STEP 1: ADD IMPORTS (near top of App.jsx)
// ============================================================================

/*
Add these imports near your other imports:

import SalesTrackerTab, { SIDE_HUSTLE_CONFIG, SIDE_HUSTLE_OPTIONS } from './SalesTrackerTab';
import WelcomeSideHustleModal, { SideHustleDropdown, SideHustleBadge } from './SideHustleSelector';
*/

// ============================================================================
// STEP 2: ADD STATE FOR SIDE HUSTLE (in your main App component)
// ============================================================================

/*
Add to your state declarations:

const [showSideHustleWelcome, setShowSideHustleWelcome] = useState(false);

// Modify your user state to include sideHustle
// When loading user from localStorage, include sideHustle:
const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('pn_user');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  return null;
});
*/

// ============================================================================
// STEP 3: SHOW WELCOME MODAL FOR NEW USERS
// ============================================================================

/*
After successful login/signup, check if user has set their side hustle:

// In your login success handler:
const handleLoginSuccess = (userData) => {
  setUser(userData);
  
  // Check if this is a new user or they haven't set their side hustle
  const hasSeenWelcome = localStorage.getItem(`pn_welcome_seen_${userData.email}`);
  
  if (!hasSeenWelcome) {
    // Show the side hustle welcome modal
    setShowSideHustleWelcome(true);
  }
};

// Handle side hustle selection from welcome modal
const handleSideHustleSelect = (hustleValue) => {
  const updatedUser = { ...user, sideHustle: hustleValue };
  setUser(updatedUser);
  localStorage.setItem('pn_user', JSON.stringify(updatedUser));
  localStorage.setItem(`pn_welcome_seen_${user.email}`, 'true');
  setShowSideHustleWelcome(false);
};

// Add the modal to your JSX (before the closing </> or at the end):
{showSideHustleWelcome && (
  <WelcomeSideHustleModal
    isOpen={showSideHustleWelcome}
    onClose={() => {
      localStorage.setItem(`pn_welcome_seen_${user?.email}`, 'true');
      setShowSideHustleWelcome(false);
    }}
    onSelect={handleSideHustleSelect}
    userName={user?.firstName || 'there'}
    isDarkMode={isDarkMode}
  />
)}
*/

// ============================================================================
// STEP 4: UPDATE MANAGE ACCOUNT MODAL
// ============================================================================

/*
In your ManageAccountModal component, add the SideHustleDropdown.

Find the section with Date of Birth and Gender fields, and add after Gender:

// Add state for editing side hustle
const [editSideHustle, setEditSideHustle] = useState(user?.sideHustle || null);

// Add this JSX after the Gender dropdown, before Save Changes button:

{/* Side Hustle Section *}
<div style={{ marginTop: '24px', marginBottom: '16px' }}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`
  }}>
    <span style={{ fontSize: '20px' }}>💼</span>
    <span style={{ 
      fontSize: '16px', 
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#1e293b'
    }}>
      Side Hustle Settings
    </span>
  </div>
  
  <SideHustleDropdown
    value={editSideHustle}
    onChange={setEditSideHustle}
    isDarkMode={isDarkMode}
    showLabel={true}
  />
  
  <p style={{
    fontSize: '13px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    marginTop: '8px'
  }}>
    This customizes your Command Center with industry-specific terms, 
    tax deductions, and tips tailored to your hustle!
  </p>
</div>

// When saving changes, include the sideHustle:
const handleSaveChanges = () => {
  const updatedUser = {
    ...user,
    firstName: editFirstName,
    lastName: editLastName,
    phone: editPhone,
    dob: editDob,
    gender: editGender,
    sideHustle: editSideHustle, // ADD THIS
  };
  setUser(updatedUser);
  localStorage.setItem('pn_user', JSON.stringify(updatedUser));
  setShowManageAccount(false);
};
*/

// ============================================================================
// STEP 5: UPDATE SALES TRACKER TAB RENDERING
// ============================================================================

/*
Where you render the SalesTrackerTab, pass the user prop:

// Find where you render the sales tracker and update it:
{activeTab === 'sales' && (
  <SalesTrackerTab 
    user={user}
    isDarkMode={isDarkMode}
  />
)}

The SalesTrackerTab will automatically:
- Read user.sideHustle to determine which configuration to use
- Show "Command Center" as the title with a badge showing their hustle type
- Use industry-specific terminology for pipeline stages, deals, clients, etc.
- Show relevant tax deductions and tips for their profession
*/

// ============================================================================
// STEP 6: UPDATE SIDEBAR TO SHOW "COMMAND CENTER" INSTEAD OF "SALES TRACKER"
// ============================================================================

/*
Find the sidebar navigation item for Sales Tracker and update:

// Change the label from "Sales Tracker" to "Command Center"
// You can also add a dynamic badge showing their hustle type

{user?.sideHustle && (
  <SideHustleBadge 
    value={user.sideHustle} 
    isDarkMode={isDarkMode}
    size="small"
  />
)}

// The sidebar item should look something like:
<button
  onClick={() => setActiveTab('sales')}
  style={{...sidebarButtonStyle, ...(activeTab === 'sales' ? activeStyle : {})}}
>
  <span>⚡</span>
  <span>Command Center</span>
  {user?.sideHustle && (
    <span style={hustleBadgeSmallStyle}>
      {SIDE_HUSTLE_CONFIG[user.sideHustle]?.icon}
    </span>
  )}
</button>
*/

// ============================================================================
// COMPLETE MANAGE ACCOUNT MODAL EXAMPLE WITH SIDE HUSTLE
// ============================================================================

export const ManageAccountModalExample = ({ 
  isOpen, 
  onClose, 
  user, 
  setUser, 
  isDarkMode 
}) => {
  const [editFirstName, setEditFirstName] = useState(user?.firstName || '');
  const [editLastName, setEditLastName] = useState(user?.lastName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editDob, setEditDob] = useState(user?.dob || '');
  const [editGender, setEditGender] = useState(user?.gender || '');
  const [editSideHustle, setEditSideHustle] = useState(user?.sideHustle || null);
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    const updatedUser = {
      ...user,
      firstName: editFirstName,
      lastName: editLastName,
      phone: editPhone,
      dob: editDob,
      gender: editGender,
      sideHustle: editSideHustle,
    };
    setUser(updatedUser);
    localStorage.setItem('pn_user', JSON.stringify(updatedUser));
    onClose();
  };
  
  const modalStyle = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#1e293b',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    inputGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
      backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1e293b',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    sectionDivider: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '24px',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#1e293b',
    },
    sectionDescription: {
      fontSize: '13px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      marginTop: '8px',
    },
    saveButton: {
      width: '100%',
      padding: '14px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '24px',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: isDarkMode ? '#94a3b8' : '#64748b',
    },
  };
  
  // Import SideHustleDropdown at the top of your file
  // import { SideHustleDropdown } from './SideHustleSelector';
  
  return (
    <div style={modalStyle.overlay} onClick={onClose}>
      <div style={modalStyle.modal} onClick={e => e.stopPropagation()}>
        <div style={modalStyle.title}>
          Manage Account
          <button style={modalStyle.closeButton} onClick={onClose}>×</button>
        </div>
        
        {/* Avatar section would go here */}
        
        <div style={modalStyle.row}>
          <div style={modalStyle.inputGroup}>
            <label style={modalStyle.label}>First Name</label>
            <input
              style={modalStyle.input}
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
            />
          </div>
          <div style={modalStyle.inputGroup}>
            <label style={modalStyle.label}>Last Name</label>
            <input
              style={modalStyle.input}
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
            />
          </div>
        </div>
        
        <div style={modalStyle.row}>
          <div style={modalStyle.inputGroup}>
            <label style={modalStyle.label}>Your email</label>
            <input
              style={{...modalStyle.input, backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9'}}
              value={user?.email || ''}
              disabled
            />
          </div>
          <div style={modalStyle.inputGroup}>
            <label style={modalStyle.label}>Phone Number</label>
            <input
              style={modalStyle.input}
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </div>
        </div>
        
        <div style={modalStyle.row}>
          <div style={modalStyle.inputGroup}>
            <label style={modalStyle.label}>Date of Birth</label>
            <input
              style={modalStyle.input}
              type="date"
              value={editDob}
              onChange={(e) => setEditDob(e.target.value)}
            />
          </div>
          <div style={modalStyle.inputGroup}>
            <label style={modalStyle.label}>Gender</label>
            <select
              style={modalStyle.input}
              value={editGender}
              onChange={(e) => setEditGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not">Prefer not to say</option>
            </select>
          </div>
        </div>
        
        {/* ============================================ */}
        {/* NEW: SIDE HUSTLE SECTION */}
        {/* ============================================ */}
        <div style={modalStyle.sectionDivider}>
          <span style={{ fontSize: '20px' }}>💼</span>
          <span style={modalStyle.sectionTitle}>Side Hustle Settings</span>
        </div>
        
        {/* 
          IMPORTANT: Import SideHustleDropdown from './SideHustleSelector'
          and use it here:
          
          <SideHustleDropdown
            value={editSideHustle}
            onChange={setEditSideHustle}
            isDarkMode={isDarkMode}
            showLabel={false}
          />
        */}
        
        {/* Placeholder for the dropdown - replace with actual component */}
        <div style={{
          padding: '14px 16px',
          borderRadius: '10px',
          border: `2px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
          backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
          color: isDarkMode ? '#94a3b8' : '#64748b',
          fontSize: '14px',
        }}>
          {editSideHustle ? `Selected: ${editSideHustle}` : 'Select your side hustle (optional)'}
        </div>
        
        <p style={modalStyle.sectionDescription}>
          This customizes your Command Center with industry-specific terms, 
          tax deductions, and tips tailored to your hustle!
        </p>
        
        <button style={modalStyle.saveButton} onClick={handleSave}>
          Save Changes
        </button>
        
        {/* Membership section and Cancel Account would go here */}
      </div>
    </div>
  );
};

// ============================================================================
// QUICK REFERENCE: SIDE HUSTLE VALUES AND THEIR FEATURES
// ============================================================================

/*
| Value              | Name                    | Icon | Deal Term     | Client Term  |
|--------------------|-------------------------|------|---------------|--------------|
| real-estate        | Real Estate             | 🏠   | Transaction   | Client       |
| photographer       | Photography             | 📸   | Session       | Client       |
| hair-stylist       | Hair & Beauty           | 💇   | Appointment   | Client       |
| makeup-artist      | Makeup Artist           | 💄   | Appointment   | Client       |
| fitness-trainer    | Fitness & Training      | 💪   | Session       | Client       |
| freelance-creative | Freelance Creative      | 🎨   | Project       | Client       |
| content-creator    | Content Creator         | 📱   | Campaign      | Brand        |
| music-dj           | Music / DJ              | 🎵   | Gig           | Client       |
| consultant         | Consulting              | 💼   | Engagement    | Client       |
| event-planner      | Event Planning          | 🎉   | Event         | Client       |
| ecommerce          | E-commerce / Seller     | 🛒   | Order         | Customer     |
| handyman           | Handyman / Contractor   | 🔧   | Job           | Client       |
| pet-services       | Pet Services            | 🐕   | Booking       | Client       |
| notary             | Notary / Loan Signing   | 📝   | Signing       | Client       |
| general-sales      | Sales Professional      | 🎯   | Deal          | Client       |
| other              | Other Business          | ✨   | Project       | Client       |
*/

// ============================================================================
// TESTING CHECKLIST
// ============================================================================

/*
✅ New user signup → Shows welcome modal asking about side hustle
✅ User can select from categorized list of side hustles
✅ User can skip/answer later
✅ Selection persists in localStorage with user data
✅ Command Center shows correct terminology based on selection
✅ Manage Account has side hustle dropdown
✅ User can change side hustle anytime in Manage Account
✅ Command Center updates immediately when side hustle changes
✅ Tax deductions are profession-specific
✅ Quick tips are profession-specific
✅ Pipeline stages match the profession
✅ CRM stages match the profession
*/

export default {};
