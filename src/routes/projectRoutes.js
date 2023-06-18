import express from "express";

import {
  getProjects,
  newProject,
  getProject,
  updateProject,
  deleteProject,
  addCollaborator,
  findCollaborator,
  deleteCollaborator,
} from "../controllers/projectController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/", checkAuth, getProjects);
router.post("/", checkAuth, newProject);

router
  .route("/:id")
  .get(checkAuth, getProject)
  .put(checkAuth, updateProject)
  .delete(checkAuth, deleteProject);

router.post("/collaborators", checkAuth, findCollaborator);
router.post("/collaborators/:id", checkAuth, addCollaborator);
router.post("/delete-collaborator/:id", checkAuth, deleteCollaborator);

export default router;