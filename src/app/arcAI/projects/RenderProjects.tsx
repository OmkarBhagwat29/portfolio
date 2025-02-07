"use client";

import React, { useEffect, useState } from "react";
import { GetProjectSummary } from "../models/project";

import DeleteProject from "./DeleteProject";
import AddProject from "./AddProject";
import UpdateProject from "./UpdateProject";
import { FaEdit } from "react-icons/fa";

const RenderProjects = () => {
  const [projects, setProjects] = useState<GetProjectSummary[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [editProject, setEditProject] = useState<GetProjectSummary | undefined>(
    undefined
  );

  useEffect(() => {
    fetch("/api/arcAI/projects")
      .then((data) => data.json())
      .then((prjs) => {
        setProjects(prjs);
        setIsLoading(false);
      })
      .catch((er) => console.log("you got error->", er));

    console.log("calling get projects");
  }, []);

  const handleOpenProject = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="absolute flex flex-wrap gap-5">
        {projects.map((prj) => (
          <div
            key={prj.id}
            className="relative top-2 left-2 w-48 h-56 bg-slate-300 rounded-r-xl shadow-lg cursor-pointer hover:bg-slate-200 active:bg-slate-100 transition-colors duration-200 select-none"
            onDoubleClick={handleOpenProject}
          >
            <div className="relative left-2 top-2 gap-5">
              <div>{prj.name}</div>
              <div>{prj.disciplineName}</div>
            </div>

            <DeleteProject project={prj} setProjects={setProjects} />
            <FaEdit
              className="absolute w-5 h-5 top-1 right-1 hover:opacity-50 cursor-pointer active:opacity-5"
              onClick={(e) => {
                e.stopPropagation();
                setEditProject(prj);
              }}
            />
          </div>
        ))}

        {!isLoading && <AddProject setProjects={setProjects} />}
        {editProject && (
          <UpdateProject
            project={editProject}
            setEditProject={setEditProject}
            setProjects={setProjects}
          />
        )}
      </div>
    </>
  );
};

export default RenderProjects;
