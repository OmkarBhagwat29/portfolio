import React, { FC } from "react";
import { MdDelete } from "react-icons/md";
import { GetProjectSummary } from "../models/project";

interface DeleteProjectProps {
  project: GetProjectSummary;
  setProjects: React.Dispatch<React.SetStateAction<GetProjectSummary[]>>;
}

const DeleteProject: FC<DeleteProjectProps> = ({ project, setProjects }) => {
  const handleDeleteProject = async (e: React.MouseEvent) => {
    e.stopPropagation();

    await fetch(`/api/arcAI/projects`, {
      method: "DELETE",
      body: JSON.stringify({ id: project.id }),
    });

    setProjects((prev: GetProjectSummary[]) =>
      prev.filter((p) => p.id !== project.id)
    );
  };
  return (
    <MdDelete
      className="absolute w-5 h-5 bottom-1 right-1  hover:opacity-50 cursor-pointer active:opacity-5"
      onClick={handleDeleteProject}
    />
  );
};

export default DeleteProject;
