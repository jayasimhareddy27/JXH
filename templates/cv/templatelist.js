'use client';

import { layoutGrid01, RESUME_IDS01,Template01,Template01Preview } from './templates/template01/index';


const templates = [
  { id: 'template01', name: 'Default resume by JXH', Component: Template01Preview, page:Template01, layout:layoutGrid01,RESUME_IDS:RESUME_IDS01},
];


export function getTemplateById(id) {
  const template = templates.find((t) => t.id === id);
  return template;
}

export { templates}