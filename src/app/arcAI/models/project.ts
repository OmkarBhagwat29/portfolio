export type GetProjectSummary = {
  id: string;
  name: string;
  disciplineName: string;
};

export type CreateProjectDetail = {
  name: string;
  disciplineId: string;
};

export type UpdateProjectModel = {
  id: string;
  name: string;
  disciplineId: string;
};
