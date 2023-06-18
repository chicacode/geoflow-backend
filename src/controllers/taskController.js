import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { project } = req.body;

  const projectExisted = await Project.findById(project);

  if (!projectExisted) {
    const error = new Error("Project does not exist");
    return res.status(404).json({ msg: error.message });
  }

  if (projectExisted.creator.toString() !== req.user._id.toString()) {
    const error = new Error("You do not have permissions to add tasks");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const taskStored = await Task.create(req.body);

    projectExisted.tasks.push(taskStored._id);
    await projectExisted.save();
    res.json(taskStored);

  } catch (error) {
    console.log(error);
  }
};

const getTask = async (req, res) => {
    const { id } = req.params;

    const task = await Task.findById(id).populate("project");
  
    if (!task) {
      const error = new Error("Task not Found");
      return res.status(404).json({ msg: error.message });
    }
  
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Invalid Action");
      return res.status(403).json({ msg: error.message });
    }
  
    res.json(task);
};

const updateTask = async (req, res) => {
    const { id } = req.params;

    const task = await Task.findById(id).populate("project");
  
    if (!task) {
      const error = new Error("Task not Found");
      return res.status(404).json({ msg: error.message });
    }
  
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Invalid Action");
      return res.status(403).json({ msg: error.message });
    }

    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dateDelivered = req.body.dateDelivered || task.dateDelivered;

    try {
        const taskStored = await task.save();
        res.json(taskStored);
      } catch (error) {
        console.log(error);
      }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    const task = await Task.findById(id).populate("project");
  
    if (!task) {
      const error = new Error("Task not Found");
      return res.status(404).json({ msg: error.message });
    }
  
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Invalid Action");
      return res.status(403).json({ msg: error.message });
    }

    try{
        const project = await Project.findById(task.project);
        project.tasks.pull(task._id);
        await Promise.allSettled([await project.save(), await task.deleteOne()]);
        res.json({ msg: "Task Deleted" });
    }catch(error){
        console.log(error)
    }
};

const changeState = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("Task not Found");
    return res.status(404).json({ msg: error.message });
  }


  if (task.project.creator.toString() !== req.user._id.toString() &&
  !task.project.colaborators.some((collaborators) => collaborators._id.toString() === req.user._id.toString()
  )){
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }

  task.state = !task.state;
  task.completed = req.user._id;
  await task.save();

  const taskSaved = await Task.findById(id)
    .populate("project")
    .populate("completed");

  res.json(taskSaved);
};

export { addTask, getTask, updateTask, deleteTask, changeState };