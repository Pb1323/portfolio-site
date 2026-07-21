"use client";

import { useState } from "react";
import ProjectsGrid from "./ProjectsGrid";
import ProjectDetailView from "./ProjectDetailView";
import type { Project } from "@/data/projects";

export default function ProjectsSection() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <>
      <ProjectsGrid onOpenProject={setActive} />
      <ProjectDetailView project={active} onClose={() => setActive(null)} />
    </>
  );
}
