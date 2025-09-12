import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  House,
  LUCIDE_ICONS,
  LucideIconProvider,
  Menu,
  Search,
  UserCheck,
  X,
  CirclePlus,
  Moon,
  Sun,
  Monitor,
  CalendarDays,
  CalendarRange
} from 'lucide-angular';

const icons = { File, House, Menu, UserCheck, ChevronDown, X, Search, Folder, ChevronRight, CirclePlus, Moon, Sun, Monitor, CalendarDays,CalendarRange };

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }
  ]
};
