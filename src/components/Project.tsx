import ProjectCard from './ProjectCard';

const projects = [
  { title: 'Project 1', description: 'Description for Project 1', image: '/project1.jpg' },
  { title: 'Project 2', description: 'Description for Project 2', image: '/project2.jpg' },
];

export default function Projects() {
  return (
    <section id='projects' className='grid grid-cols-2 gap-4 p-8'>
      {projects.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
    </section>
  );
}
