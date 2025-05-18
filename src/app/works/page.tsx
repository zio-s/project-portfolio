import React from 'react';
import WorksPage from './WorksPage';
import { projectsData } from '@/data/projects';
const page = () => {
  return <WorksPage projectsData={projectsData} />;
};

export default page;
