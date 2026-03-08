const TodoItem = ({ item, onToggle, onDelete }) => {
  const isSystem = item.source === "system";
  const isCompleted = item.status === "completed";

  return (
    <div className={`todo-item ${isCompleted ? "todo-item--done" : ""} ${isSystem ? "todo-item--system" : ""}`}>
      {/* System items get a static indicator; custom items get a checkbox */}
      {isSystem ? (
        <span className="todo-item__system-dot" aria-hidden="true" />
      ) : (
        <input
          type="checkbox"
          className="todo-item__check"
          checked={isCompleted}
          onChange={() => onToggle(item)}
        />
      )}

      <span className="todo-item__title">{item.title}</span>

      {/* Badge for system items */}
      {isSystem && (
        <span className="todo-item__badge">{item.action}</span>
      )}

      {/* Delete only for custom items */}
      {!isSystem && (
        <button
          className="todo-item__delete"
          onClick={() => onDelete(item)}
          aria-label="Delete task"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default TodoItem;