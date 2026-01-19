'use client';

import { layoutGrid01, RESUME_IDS01,Template01,Template01Preview } from './templates/template01/index';
import { layoutGrid02, RESUME_IDS02,Template02,Template02Preview } from './templates/template02/index';


const templates = [
  { id: 'template01', name: 'Default resume by JXH', Component: Template01Preview, page:Template01, layout:layoutGrid01,RESUME_IDS:RESUME_IDS01},
  { id: 'template02', name: 'Classic', Component: Template02Preview, page:Template02, layout:layoutGrid02,RESUME_IDS:RESUME_IDS02},
];


export function getTemplateById(id) {
  const template = templates.find((t) => t.id === id);
  return template;
}

export { templates}