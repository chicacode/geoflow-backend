import Project from "../models/Project.js";
import User from "../models/User.js";

const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [{ colaborators: { $in: req.user } }, { creator: { $in: req.user } }],
  }).select("-tasks");

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
  const project = await Project.findById(id)
    .populate({
      path: "tasks",
      populate: { path: "completed", select: "name" },
    })
    .populate("colaborators", "name email");

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

const addCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Not Found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(401).json({ msg: error.message });
  }

  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    "-success -createdAt -password -token -updatedAt -__v "
  );

  if (!user) {
    const error = new Error("User not found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() === user._id.toString()) {
    const error = new Error("Project creator cannot be collaborator");
    return res.status(404).json({ msg: error.message });
  }

  // avoid duplication
  if (project.colaborators.includes(user._id)) {
    const error = new Error("User is alredy in the project as collaborator");
    return res.status(404).json({ msg: error.message });
  }

  project.colaborators.push(user._id);
  await project.save();
  res.json({ msg: "Colaborator added correctly" });
};

const findCollaborator = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    "-success -createdAt -password -token -updatedAt -__v "
  );

  if (!user) {
    const error = new Error("User not found");
    return res.status(404).json({ msg: error.message });
  }

  res.json(user);
};

const deleteCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Project Not Found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(401).json({ msg: error.message });
  }

  project.colaborators.pull(req.body.id);
  await project.save()
  res.json({msg: "Collaborator deleted correctly"})

};

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
