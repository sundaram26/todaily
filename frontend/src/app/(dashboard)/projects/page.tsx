import CreateProjectCard from "@/features/project/components/create-project-card";
import ProjectCard from "@/features/project/components/project-card";



function page() {
    return (
      <div className="grid h-[calc(100vh-68px)] grid-cols-3 grid-rows-2">
        <CreateProjectCard />
        <ProjectCard />
      </div>
    );
}

export default page;