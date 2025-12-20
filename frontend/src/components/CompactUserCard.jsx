import DeleteIcon from '@mui/icons-material/Delete';

export default function CompactUserCard({ user, showDelete = false, onDelete }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(user._id, e);
    }
  };

  return (
    <div className="compactUserCard">
      <div className="compactUserImg">
        {user.profilePicture ? (
          <img
            src={user.profilePicture.startsWith('/uploads/')
              ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${user.profilePicture}`
              : user.profilePicture}
            alt="Profile"
            className="compactUserImage"
            onError={e => {e.target.onerror = null; e.target.src = '/assets/logo.png';}}
          />
        ) : (
          <div className="compactUserPlaceholder">👤</div>
        )}
      </div>
      <div className="compactUserInfo">
        <h4 className="compactUserName">{user.firstName} {user.lastName}</h4>
        <div className="compactUserEmail">{user.email}</div>
        <div className="compactUserRole">Role: <b>{user.role}</b></div>
        {user.location && <div className="compactUserLocation">{user.location}</div>}
        {user.skills?.length > 0 && (
          <div className="compactUserSkills">Skills: {user.skills.slice(0, 2).join(', ')}{user.skills.length > 2 ? '...' : ''}</div>
        )}
        {showDelete && (
          <button
            className="compactDeleteButton"
            onClick={handleDeleteClick}
            title="Delete User"
          >
          <DeleteIcon
            sx={{
                backgroundColor: "#f97316",
                borderRadius: "10px",
                padding: "4px",
                cursor: "pointer",
                "&:hover": {
                backgroundColor: "#fed7aa",
                },
            }}
            />
          </button>
        )}
      </div>
    </div>
  );
}