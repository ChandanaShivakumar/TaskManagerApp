import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useAuth } from './AuthContext';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../Style/task.css';

Modal.setAppElement('#root');

const ItemTypes = {
  CARD: 'card',
};

const Task = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [taskColumn, setTaskColumn] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('TODO');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/task/${user.id}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (user && user.id) {
      fetchTasks();
    }
  }, [user]);

  // Modals
  const openModal = (task) => {
    setSelectedTask(task);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTask(null);
  };

  // Delete Task
  const deleteTask = async (taskid) => {
    try {
      await axios.delete(`http://localhost:8800/task/${taskid}`);
      setTasks(tasks.filter(task => task.taskid !== taskid));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // DateTime formatting
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Handle Add Task
  const handleAddTask = async () => {
    try {
      const newTask = {
        taskname: taskName,
        taskdescription: taskDescription,
        taskcreateddate: formatDate(new Date()),
        taskcolumn: selectedColumn,
        userid: user.id
      };

      // Send the POST request
      const response = await axios.post('http://localhost:8800/task', newTask);
      setTasks([...tasks, response.data]);
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Edit Modals
  const openEditModal = (task) => {
    setTaskName(task.taskname);
    setTaskDescription(task.taskdescription);
    setTaskColumn(task.taskcolumn);
    setEditModalIsOpen(true);
    setSelectedTask(task);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setSelectedTask(null);
  };

  // Handle Update Task
  const handleUpdateTask = async () => {
    try {
      await axios.put(`http://localhost:8800/task/${selectedTask.taskid}`, {
        taskname: taskName,
        taskdescription: taskDescription,
        taskcolumn: taskColumn,
      });
      setTasks(tasks.map(task =>
        task.taskid === selectedTask.taskid
          ? { ...task, taskname: taskName, taskdescription: taskDescription, taskcolumn: taskColumn }
          : task
      ));
      closeEditModal();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Drag and Drop functionality
  const moveTask = (taskId, toColumn) => {
    const task = tasks.find(t => t.taskid === taskId);
    if (task) {
      task.taskcolumn = toColumn;
      setTasks([...tasks]);
      axios.put(`http://localhost:8800/task/${taskId}`, {
        ...task,
        taskcolumn: toColumn,
      }).catch(error => console.error('Error updating task column:', error));
    }
  };

  const TaskCard = ({ task }) => {
    const [, ref] = useDrag({
      type: ItemTypes.CARD,
      item: { taskId: task.taskid },
    });

    return (
      <div ref={ref} className="nested-card">
        <div className="card-body icard-body">
          <h6 className="card-title">{task.taskname}</h6>
          <p className="card-text">{task.taskdescription}</p>
          <br />
          <p className="card-text">Created at: {new Date(task.taskcreateddate).toLocaleString()}</p>
          <div className="btnn">
            <button className="btn btn-del" onClick={() => deleteTask(task.taskid)}>Delete</button>&nbsp;
            <button className="btn btn-edi" onClick={() => openEditModal(task)}>Edit</button>&nbsp;
            <button className="btn btn-vie" onClick={() => openModal(task)}>View Details</button>&nbsp;
          </div>
        </div>
      </div>
    );
  };

  const Column = ({ column, children }) => {
    const [, ref] = useDrop({
      accept: ItemTypes.CARD,
      drop: (item) => moveTask(item.taskId, column),
    });

    return (
      <div ref={ref} className="col">
        <div className="card">
          <div className="card-body">
            <h6 className="card-title tcard-title">{column}</h6>
            {children}
          </div>
        </div>
      </div>
    );
  };

  const renderTasks = (column) => {
    return tasks
      .filter(task => task.taskcolumn === column)
      .map(task => (
        <TaskCard key={task.taskid} task={task} />
      ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {/* Add Button */}
        <div className="tcontainer">
          <button className="btn btn-primary prim" onClick={() => setModalIsOpen(true)}>
            Add Task
          </button>
        </div>

        {/* Search bar and sort by */}
        <div className="task">
          <div className="card tcard">
            <div className="tcard-body">
              <div className="card-content">
                <div className="search-container">
                  <label>Search:</label>&nbsp;
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search..."
                  />
                  <label>Sort by:</label>&nbsp;
                  <select className="sort-dropdown">
                    <option value="">Recent</option>
                    <option value="date">Date</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />

        {/* Task Cards */}
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <Column column="TODO">{renderTasks('TODO')}</Column>
          <Column column="INPROGRESS">{renderTasks('INPROGRESS')}</Column>
          <Column column="DONE">{renderTasks('DONE')}</Column>
        </div>

        {/* Modal for Task Details */}
        {selectedTask && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Task Details"
            className="task-modal"
            overlayClassName="task-modal-overlay"
          >
            <h6><b>Task Details</b></h6>
            <br></br>
            <h6><u>Task Title: {selectedTask.taskname}</u></h6>
            <p>Description: {selectedTask.taskdescription}</p>
            <p className='createdat'>Created at: {new Date(selectedTask.taskcreateddate).toLocaleString()}</p>
            <div className='btnn'>
              <button className="btn btn-vie" style={{ textAlign: 'right' }} onClick={closeModal}>Close</button>
            </div>
          </Modal>
        )}

        {/* Modal for Adding Task */}
        <Modal
          isOpen={modalIsOpen && !selectedTask}
          onRequestClose={closeModal}
          contentLabel="Add Task"
          className="task-modal"
          overlayClassName="task-modal-overlay"
        >
          <h6><b>Add New Task</b></h6>
          <br />
          <div className="form-group">
            <label htmlFor="taskname">Task Name:</label>
            <input
              type="text"
              id="taskname"
              name="taskname"
              placeholder="Task Name"
              onChange={(e) => setTaskName(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="taskdescription">Description:</label>
            <textarea
              id="taskdescription"
              name="taskdescription"
              placeholder="Task Description"
              onChange={(e) => setTaskDescription(e.target.value)}
              className="form-control"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="taskcolumn">Task Column:</label>
            <select
              id="taskcolumn"
              name="taskcolumn"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="form-control"
            >
              <option value="TODO">TODO</option>
              <option value="INPROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taskcreateddate">Created Date:</label>
            <input
              type="text"
              id="taskcreateddate"
              name="taskcreateddate"
              value={new Date().toLocaleString()}
              readOnly
              className="form-control"
            />
          </div>
          <div className="btnn">
            <button className="btn btn-primary" onClick={handleAddTask}>Add</button>&nbsp;
            <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
          </div>
        </Modal>

        {/* Modal for Editing Task */}
        {selectedTask && (
          <Modal
            isOpen={editModalIsOpen}
            onRequestClose={closeEditModal}
            contentLabel="Edit Task"
            className="task-modal"
            overlayClassName="task-modal-overlay"
          >
            <h6><b>Edit Task</b></h6>
            <br></br>
            <form>
              <div>
                <label htmlFor="taskName">Task Name:</label>
                <input
                  id="taskName"
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <label htmlFor="taskDescription">Description:</label>
                <textarea
                  id="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <label htmlFor="taskColumn">Task Column:</label>
                <select
                  id="taskColumn"
                  value={taskColumn}
                  onChange={(e) => setTaskColumn(e.target.value)}
                  className="form-control"
                >
                  <option value="TODO">TODO</option>
                  <option value="INPROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
              <br></br>
              <button type="button" className="btn btn-primary" onClick={handleUpdateTask}>Update</button>&nbsp;
              <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
            </form>
          </Modal>
        )}
      </div>
    </DndProvider>
  );
};

export default Task;
