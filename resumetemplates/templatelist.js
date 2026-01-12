'use client';
import Template01Preview from './templates/template01/preview';
import Template01 from './templates/template01/page';
import Template02Preview from './templates/template02/preview';
import Template02 from './templates/template02/page';

const templates = [
  { id: 'template01', name: 'Default resume by JXH', Component: Template01Preview, page:Template01 },
  { id: 'template02', name: 'Classic Grey', Component: Template02Preview, page:Template02 },
];


export function getTemplateNameById(id) {
  const template = templates.find((t) => t.id === id);
  return template ? template.name : null;
}

export { templates}