export type Qualification = {
  id: string;
  credential: string;
  detail: string;
  institution: string;
  year: string;
};

export const qualifications: Qualification[] = [
  {
    id: "quals-1",
    credential: "GCSEs (in progress)",
    detail: "Triple science and a full GCSE spread, predicted grades 8–9",
    institution: "State grammar school, north London",
    year: "2027",
  },
];
