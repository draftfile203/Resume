import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { ProjectsComponent } from './projects/projects.component';

export const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'education', component:EducationComponent},
  {path: 'experience', component:ExperienceComponent},
  {path: 'projects', component:ProjectsComponent}
];
