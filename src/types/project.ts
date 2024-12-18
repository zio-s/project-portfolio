export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  client: string;
  image: string[];
  colors: {
    color1: string;
    color2: string;
    color3: string;
    color4: string;
    color5: string;
    color6: string;
    color7: string;
    color8: string;
    color9: string;
  };
  links: {
    live?: string;
    details?: string;
  };
}

export interface ProjectCardProps {
  project: Project;
  index: number;
  isActive: boolean;
}
export interface ProjectColors {
  colors: Project;
}
