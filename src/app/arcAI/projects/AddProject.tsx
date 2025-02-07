import React, { FC, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import Modal from "../ui/components/Modal";
import { CreateProjectDetail, GetProjectSummary } from "../models/project";
import ProjectForm from "./ProjectForm";

interface AddProjectProps {
  setProjects: React.Dispatch<React.SetStateAction<GetProjectSummary[]>>;
}

const AddProject: FC<AddProjectProps> = ({ setProjects }) => {
  const [showModal, setShowModal] = useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectName = formData.get("projectName");
    const disciplineId = formData.get("discipline");

    if (!projectName || !disciplineId) return;

    const prj: CreateProjectDetail = {
      name: projectName.toString(),
      disciplineId: disciplineId.toString(),
    };

    const res = await fetch("/api/arcAI/projects", {
      method: "POST",
      body: JSON.stringify(prj),
    });

    if (res.ok) {
      const project = await res.json();
      setProjects((prv) => [...prv, project]);
      setShowModal(false);
    }
  };

  return (
    <>
      <CiSquarePlus
        className="relative w-8 h-8 rounded-full hover:bg-slate-300 active:bg-slate-100 top-2 cursor-pointer transition-colors duration-200"
        onClick={handleAddClick}
      />

      <Modal showModal={showModal} setShowModal={setShowModal}>
        <ProjectForm
          title="New Project"
          handleSubmit={handleSubmit}
          submitButtonName="Create Project"
        />
      </Modal>
    </>
  );
};

export default AddProject;
