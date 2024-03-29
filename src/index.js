import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import userRoutes from "../src/routes/userRoutes.js";
import projectRoutes from "../src/routes/projectRoutes.js";
import taskRoutes from "../src/routes/taskRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

//Setup cors
const whitelist = [process.env.FRONTEND_URL];
console.log("whitelist", whitelist)
const corsOptions = {
  origin: function (origin, callback) {
    console.log(whitelist.includes(origin))
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed byy CORS"));
    }
  },
};

app.use(cors());
//Routing
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
