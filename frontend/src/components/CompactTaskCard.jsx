import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

export default function CompactTaskCard({ task, showActions = false, onComplete, onAccept, updating = false, showDelete = false, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/task/${task._id}`);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    if (action === 'complete' && onComplete) {
      onComplete(task._id);
    } else if (action === 'accept' && onAccept) {
      onAccept(task._id);
    } else if (action === 'delete' && onDelete) {
      onDelete(task._id, e);
    }
  };

  return (
    <div className="compactTaskCard" onClick={handleCardClick} style={{cursor: 'pointer'}}>
      <div className="compactTaskImg">
        {task.image ? (
          <img
            src={task.image.startsWith('/uploads/')
              ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${task.image}`
              : task.image}
            alt="Task"
            className="compactTaskImage"
            onError={e => {e.target.onerror = null; e.target.src = '/assets/logo.png';}}
          />
        ) : (
          <div className="compactImagePlaceholder">image</div>
        )}
      </div>
      <div className="compactTaskInfo">
        <h4 className="compactTaskTitle">{task.title}</h4>
        <div className="compactTaskMeta">
          <span className="compactTaskStatus">{task.status}</span>
          <span className="compactTaskBudget">NPR {task.budget}</span>
        </div>
        <div className="compactTaskCategory">{task.category}</div>
        {showActions && task.status === 'in progress' && (
          <button
            className="compactCompleteButton"
            disabled={updating}
            onClick={e => handleActionClick(e, 'complete')}
          >
            {updating ? 'Updating...' : 'Complete'}
          </button>
        )}
        {showActions && task.status === 'open' && (
          <button
            className="compactAcceptButton"
            onClick={e => handleActionClick(e, 'accept')}
          >
            Accept
          </button>
        )}
        {showDelete && (
          <button
            className="compactDeleteButton"
            onClick={e => handleActionClick(e, 'delete')}
            title="Delete Task"
          >
            <DeleteIcon style={{fontSize: '16px'}} />
          </button>
        )}
      </div>
    </div>
  );
}