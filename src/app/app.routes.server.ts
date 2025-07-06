import { RenderMode, ServerRoute } from '@angular/ssr';
import { ResetPasswordComponent } from './core/pages/reset-password/reset-password.component';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'reset-password/:token',
    renderMode: RenderMode.Server,
  },
  {
    path: 'agent-dashboard/agent-add-car/:id',
    renderMode: RenderMode.Server,
  },
];
