import React, { FC, useEffect, useState } from "react";
import { GetProjectSummary, UpdateProjectModel } from "../models/project";
import Modal from "../ui/components/Modal";
import ProjectForm from "./ProjectForm";
import { Discipline } from "../models/discipline";

interface UpdateProjectProps {
  project: GetProjectSummary;
  setEditProject: (prj: GetProjectSummary | undefined) => void;
  setProjects: React.Dispatch<React.SetStateAction<GetProjectSummary[]>>;
}

const UpdateProject: FC<UpdateProjectProps> = ({
  project,
  setEditProject,
  setProjects,
}) => {
  const [showModal, setShowModal] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let storedDisciplines = localStorage.getItem("disciplines");

    if (!storedDisciplines) {
      fetch("/api/arcAI/disciplines")
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("disciplines", JSON.stringify(data));
        })
        .catch((err) => console.error("Error fetching disciplines:", err));

      storedDisciplines = localStorage.getItem("disciplines");
    }
    if (!storedDisciplines) {
      setEditProject(undefined);
      setShowModal(false);
      return;
    }

    const disciplines = JSON.parse(storedDisciplines) as Discipline[];

    const formData = new FormData(e.currentTarget);
    let projectName = formData.get("projectName");
    const disciplineId = formData.get("discipline");

    if (!projectName) {
      projectName = project.name;
    }

    if (!disciplineId) {
      setEditProject(undefined);
      setShowModal(false);
      return;
    }

    const disciplineNames = disciplines
      .filter((d) => d.id === disciplineId)
      .map((d) => d.name);

    if (
      projectName === project.name &&
      disciplineNames.length === 1 &&
      disciplineNames[0] === project.disciplineName
    ) {
      setEditProject(undefined);
      setShowModal(false);
      return;
    }

    const uP: UpdateProjectModel = {
      id: project.id,
      name: projectName.toString(),
      disciplineId: disciplineId.toString(),
    };
    //update here
    const res = await fetch("/api/arcAI/projects", {
      method: "PUT",
      body: JSON.stringify(uP),
    });

    if (res.ok) {
      //update the project in state

      setProjects((prv) =>
        prv.map((p) =>
          p.id === project.id
            ? { ...p, name: uP.name, disciplineName: disciplineNames[0] }
            : p
        )
      );

      setEditProject(undefined);
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (!showModal) {
      setEditProject(undefined);
    }
  }, [showModal, setEditProject]);

  return (
    <>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <ProjectForm
          title="Edit Project"
          submitButtonName="Update Project"
          handleSubmit={handleSubmit}
          projectName={project.name}
          disciplineName={project.disciplineName}
        />
      </Modal>
    </>
  );
};

export default UpdateProject;
