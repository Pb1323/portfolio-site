export type Qualification = {
  id: string;
  credential: string;
  detail: string;
  institution: string;
  year: string;
};

// PLACEHOLDER CONTENT — replace every bracketed field with your real qualifications
// (exact subjects/grades/institutions/years) before this ships to production.
export const qualifications: Qualification[] = [
  {
    id: "quals-1",
    credential: "[Qualification — e.g. A-Levels]",
    detail: "[Subjects & grades]",
    institution: "[School/college name]",
    year: "[Year]",
  },
  {
    id: "quals-2",
    credential: "[Qualification — e.g. GCSEs]",
    detail: "[Summary, e.g. 9x grade 9-7]",
    institution: "[School name]",
    year: "[Year]",
  },
];
