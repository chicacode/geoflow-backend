import Project from "../models/Project.js";
import User from "../models/User.js";

const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [
      { colaborators: { $in: req.user } },
      { creator: { $in: req.user } },
    ],
  }).select("-tasks");;

  res.json(projects);
};

const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const projectStored = await project.save();
    res.json(projectStored);
  } catch (error) {
    console.log(error);
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  
  if (
    project.creator.toString() !== req.user._id.toString() &&
    !project.colaborators.some(
      (colaborator) => colaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error("Invalid Action");
    return res.status(401).json({ msg: error.message });
  }
  res.json(project);
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (
    project.creator.toString() !== req.user._id.toString() &&
    !project.colaborators.some(
      (colaborator) => colaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error("Invalid Action");
    return res.status(401).json({ msg: error.message });
  }

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.dateDelivered = req.body.dateDelivered || project.dateDelivered;
  project.client = req.body.client || project.client;

  try {
    const projectStored = await project.save();
    res.json(projectStored);
  } catch (error) {
    console.log(error);
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Not Found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await project.deleteOne();
    res.json({ msg: "Project Deleted" });
  } catch (error) {
    console.log(error);
  }
};

const addCollaborator = async (req, res) => {};

const findCollaborator = async (req, res) => {};

const deleteCollaborator = async (req, res) => {};

export {
  getProjects,
  newProject,
  getProject,
  updateProject,
  deleteProject,
  addCollaborator,
  findCollaborator,
  deleteCollaborator,
};