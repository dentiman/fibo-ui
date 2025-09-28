import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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

const icons = { File, House, Menu, UserCheck, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, Search, Folder, CirclePlus, Moon, Sun, Monitor, CalendarDays, CalendarRange };

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }
  ]
};
