import React, { FC, useEffect, useState } from "react";
import { Discipline } from "../models/discipline";

interface AddProjectFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonName: string;
  title: string;
  projectName?: string;
  disciplineName?: string;
}
const ProjectForm: FC<AddProjectFormProps> = ({
  handleSubmit,
  submitButtonName,
  title,
  projectName,
  disciplineName,
}) => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  useEffect(() => {
    const storedDisciplines = localStorage.getItem("disciplines");

    if (storedDisciplines) {
      let disciplines = JSON.parse(storedDisciplines) as Discipline[];

      if (disciplineName) {
        //reorder
        const main = disciplines.find((d) => d.name === disciplineName);

        if (main) {
          disciplines = disciplines.filter((d) => d.name !== disciplineName);
          disciplines = [main, ...disciplines];
        }
      }
      setDisciplines(disciplines);
    } else {
      fetch("/api/arcAI/disciplines")
        .then((res) => res.json())
        .then((data) => {
          setDisciplines(data);
          localStorage.setItem("disciplines", JSON.stringify(data));
        })
        .catch((err) => console.error("Error fetching disciplines:", err));
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-col flex items-center justify-center bg-white p-6 w-full h-full rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>

      <div className="flex flex-col">
        <label htmlFor="projectName" className="text-gray-600 font-medium">
          Project Name:
        </label>
        <input
          id="projectName"
          name="projectName"
          placeholder={`${projectName ? projectName : "enter project name"}`}
          required={projectName ? false : true}
          className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-5">
        <label htmlFor="discipline" className="mt-1 text-gray-600 font-medium">
          Disciplines:
        </label>
        <select
          id="discipline"
          name="discipline"
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-auto"
        >
          {disciplines.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-32 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        {submitButtonName}
      </button>
    </form>
  );
};

export default ProjectForm;
