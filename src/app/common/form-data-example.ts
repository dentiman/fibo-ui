import type {MenuItemType} from '@fibo-ui/components';

export  const citiesChoices = [
    { value: 'Louisville', label: 'Louisville' },
    { value: 'Memphis', label: 'Memphis' },
    { value: 'San Antonio', label: 'San Antonio' },
    { value: 'Baltimore', label: 'Baltimore' },
    { value: 'Boston', label: 'Boston' },
    { value: 'San Jose', label: 'San Jose' },
    { value: 'Austin', label: 'Austin' },
    { value: 'Dallas', label: 'Dallas' },
    { value: 'Oklahoma City', label: 'Oklahoma City' },
    { value: 'Chicago', label: 'Chicago' },
    { value: 'Washington', label: 'Washington' },
    { value: 'San Diego', label: 'San Diego' },
    { value: 'Portland', label: 'Portland' },
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'Houston', label: 'Houston' },
    { value: 'Nashville', label: 'Nashville' },
    { value: 'Philadelphia', label: 'Philadelphia' },
    { value: 'Jacksonville', label: 'Jacksonville' },
    { value: 'Fort Worth', label: 'Fort Worth' },
    { value: 'Indianapolis', label: 'Indianapolis' },
    { value: 'Columbus', label: 'Columbus' },
    { value: 'Phoenix', label: 'Phoenix' },
    { value: 'El Paso', label: 'El Paso' },
    { value: 'Seattle', label: 'Seattle' },
    { value: 'San Francisco', label: 'San Francisco' },
    { value: 'Las Vegas', label: 'Las Vegas' },
    { value: 'Denver', label: 'Denver' },
    { value: 'Charlotte', label: 'Charlotte' },
    { value: 'Detroit', label: 'Detroit' },
    { value: 'New York', label: 'New York' },
];

export interface User {
  id: number;
  email: string;
  avatar: string;
  value: number;
  label: string;
  name: string;
  phoneNumber: string;
  speciality: string;
  isDisabled: boolean;
}

export const usersChoices: User[] = [
  { id: 1, email: 'scott@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', value: 1, label: 'Scott Johnson', name: 'Scott Johnson', phoneNumber: '555-0101', speciality: 'Engineering', isDisabled: false },
  { id: 2, email: 'mike@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', value: 2, label: 'Mike Smith', name: 'Mike Smith', phoneNumber: '555-0102', speciality: 'Design', isDisabled: false },
  { id: 3, email: 'emma@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', value: 3, label: 'Emma Davis', name: 'Emma Davis', phoneNumber: '555-0103', speciality: 'Marketing', isDisabled: false },
  { id: 4, email: 'john@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', value: 4, label: 'John Wilson', name: 'John Wilson', phoneNumber: '555-0104', speciality: 'Sales', isDisabled: false },
  { id: 5, email: 'lisa@example.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', value: 5, label: 'Lisa Thompson', name: 'Lisa Thompson', phoneNumber: '555-0105', speciality: 'Finance', isDisabled: false },
  { id: 6, email: 'david@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', value: 6, label: 'David Miller', name: 'David Miller', phoneNumber: '555-0106', speciality: 'HR', isDisabled: false },
  { id: 7, email: 'anna@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', value: 7, label: 'Anna Lee', name: 'Anna Lee', phoneNumber: '555-0107', speciality: 'Operations', isDisabled: false },
  { id: 8, email: 'james@example.com', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face', value: 8, label: 'James Brown', name: 'James Brown', phoneNumber: '555-0108', speciality: 'Support', isDisabled: false },
  { id: 9, email: 'maria@example.com', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', value: 9, label: 'Maria Clark', name: 'Maria Clark', phoneNumber: '555-0109', speciality: 'Product', isDisabled: false },
  { id: 10, email: 'robert@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', value: 10, label: 'Robert Lewis', name: 'Robert Lewis', phoneNumber: '555-0110', speciality: 'QA', isDisabled: false },
  { id: 11, email: 'jennifer@example.com', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face', value: 11, label: 'Jennifer Taylor', name: 'Jennifer Taylor', phoneNumber: '555-0111', speciality: 'Security', isDisabled: false },
  { id: 12, email: 'william@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', value: 12, label: 'William Anderson', name: 'William Anderson', phoneNumber: '555-0112', speciality: 'DevOps', isDisabled: false },
  { id: 13, email: 'linda@example.com', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face', value: 13, label: 'Linda Martinez', name: 'Linda Martinez', phoneNumber: '555-0113', speciality: 'Legal', isDisabled: false },
  { id: 14, email: 'richard@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', value: 14, label: 'Richard Garcia', name: 'Richard Garcia', phoneNumber: '555-0114', speciality: 'Engineering', isDisabled: true },
  { id: 15, email: 'patricia@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', value: 15, label: 'Patricia Rodriguez', name: 'Patricia Rodriguez', phoneNumber: '555-0115', speciality: 'Design', isDisabled: false },
  { id: 16, email: 'thomas@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', value: 16, label: 'Thomas Martinez', name: 'Thomas Martinez', phoneNumber: '555-0116', speciality: 'Marketing', isDisabled: false },
  { id: 17, email: 'barbara@example.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', value: 17, label: 'Barbara Hernandez', name: 'Barbara Hernandez', phoneNumber: '555-0117', speciality: 'Sales', isDisabled: false },
  { id: 18, email: 'christopher@example.com', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face', value: 18, label: 'Christopher Lopez', name: 'Christopher Lopez', phoneNumber: '555-0118', speciality: 'Finance', isDisabled: false },
  { id: 19, email: 'elizabeth@example.com', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', value: 19, label: 'Elizabeth Gonzalez', name: 'Elizabeth Gonzalez', phoneNumber: '555-0119', speciality: 'HR', isDisabled: false },
  { id: 20, email: 'daniel@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', value: 20, label: 'Daniel Perez', name: 'Daniel Perez', phoneNumber: '555-0120', speciality: 'Operations', isDisabled: true },
  { id: 21, email: 'matthew@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', value: 21, label: 'Matthew Sanchez', name: 'Matthew Sanchez', phoneNumber: '555-0121', speciality: 'Support', isDisabled: false },
  { id: 22, email: 'jessica@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', value: 22, label: 'Jessica Ramirez', name: 'Jessica Ramirez', phoneNumber: '555-0122', speciality: 'Product', isDisabled: false },
  { id: 23, email: 'anthony@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', value: 23, label: 'Anthony Torres', name: 'Anthony Torres', phoneNumber: '555-0123', speciality: 'QA', isDisabled: false },
  { id: 24, email: 'michael@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', value: 24, label: 'Michael Flores', name: 'Michael Flores', phoneNumber: '555-0124', speciality: 'Security', isDisabled: false }
];

export const developerSkillsMenuItems: MenuItemType[] = [
  {
    label: 'Developer Skills',
    icon: 'code',
    children: [
      {
        label: 'Frontend',
        icon: 'layout-template',
        children: [
          {
            label: 'Angular',
            icon: 'component',
            children: [
              { label: 'Standalone Components', url: '/menu', icon: 'file' },
              { label: 'Signals', url: '/menu', icon: 'settings', badge: 'New' },
              { label: 'Routing', url: '/menu', icon: 'panel-right' },
            ],
          },
          {
            label: 'UX & UI',
            icon: 'file-text',
            children: [
              { label: 'Accessibility', url: '/menu', icon: 'check' },
              { label: 'Design Systems', url: '/menu', icon: 'folder' },
              { label: 'Performance', url: '/menu', icon: 'search' },
            ],
          },
        ],
      },
      {
        label: 'Backend',
        icon: 'server',
        children: [
          {
            label: 'API Design',
            icon: 'panel-right',
            children: [
              { label: 'REST', url: '/menu', icon: 'list' },
              { label: 'GraphQL', url: '/menu', icon: 'search' },
              { label: 'Versioning', url: '/menu', icon: 'chevrons-right' },
            ],
          },
          {
            label: 'Auth & Security',
            icon: 'shield-check',
            children: [
              { label: 'OAuth2 / OIDC', url: '/menu', icon: 'user-check' },
              { label: 'JWT', url: '/menu', icon: 'lock' },
              { label: 'RBAC', url: '/menu', icon: 'user' },
            ],
          },
          {
            label: 'Databases',
            icon: 'database',
            children: [
              { label: 'PostgreSQL', url: '/menu', icon: 'database' },
              { label: 'Redis', url: '/menu', icon: 'database' },
              { label: 'MongoDB', url: '/menu', icon: 'database', disabled: true, badge: 'Soon' },
            ],
          },
        ],
      },
      {
        label: 'DevOps',
        icon: 'cloud',
        children: [
          {
            label: 'Containers',
            icon: 'container',
            children: [
              { label: 'Docker', url: '/menu', icon: 'terminal' },
              { label: 'Compose', url: '/menu', icon: 'terminal' },
            ],
          },
          {
            label: 'CI / CD',
            icon: 'git-branch',
            children: [
              { label: 'Pipelines', url: '/menu', icon: 'git-branch' },
              { label: 'Release Automation', url: '/menu', icon: 'settings' },
            ],
          },
          {
            label: 'Observability',
            icon: 'search',
            children: [
              { label: 'Logs', url: '/menu', icon: 'file-text' },
              { label: 'Metrics', url: '/menu', icon: 'circle' },
              { label: 'Alerts', url: '/menu', icon: 'bell' },
            ],
          },
        ],
      },
      {
        label: 'Quality',
        icon: 'bug',
        children: [
          { label: 'Unit Testing', url: '/menu', icon: 'check' },
          { label: 'E2E Testing', url: '/menu', icon: 'search' },
          { label: 'Code Review', url: '/menu', icon: 'message-square' },
        ],
      },
      {
        label: 'Tooling',
        icon: 'wrench',
        children: [
          { label: 'CLI', url: '/menu', icon: 'terminal' },
          { label: 'Linting', url: '/menu', icon: 'check' },
          { label: 'Formatting', url: '/menu', icon: 'file-text' },
        ],
      },
    ],
  },
];
