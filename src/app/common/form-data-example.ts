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
}

export const usersChoices: User[] = [
  { id: 1, email: 'scott@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', value: 1, label: 'Scott Johnson', name: 'Scott Johnson' },
  { id: 2, email: 'mike@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', value: 2, label: 'Mike Smith', name: 'Mike Smith' },
  { id: 3, email: 'emma@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', value: 3, label: 'Emma Davis', name: 'Emma Davis' },
  { id: 4, email: 'john@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', value: 4, label: 'John Wilson', name: 'John Wilson' },
  { id: 5, email: 'lisa@example.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', value: 5, label: 'Lisa Thompson', name: 'Lisa Thompson' },
  { id: 6, email: 'david@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', value: 6, label: 'David Miller', name: 'David Miller' },
  { id: 7, email: 'anna@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', value: 7, label: 'Anna Lee', name: 'Anna Lee' },
  { id: 8, email: 'james@example.com', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face', value: 8, label: 'James Brown', name: 'James Brown' },
  { id: 9, email: 'maria@example.com', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', value: 9, label: 'Maria Clark', name: 'Maria Clark' },
  { id: 10, email: 'robert@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', value: 10, label: 'Robert Lewis', name: 'Robert Lewis' },
  { id: 11, email: 'jennifer@example.com', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face', value: 11, label: 'Jennifer Taylor', name: 'Jennifer Taylor' },
  { id: 12, email: 'william@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', value: 12, label: 'William Anderson', name: 'William Anderson' },
  { id: 13, email: 'linda@example.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', value: 13, label: 'Linda Martinez', name: 'Linda Martinez' },
  { id: 14, email: 'richard@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', value: 14, label: 'Richard Garcia', name: 'Richard Garcia' },
  { id: 15, email: 'patricia@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', value: 15, label: 'Patricia Rodriguez', name: 'Patricia Rodriguez' },
  { id: 16, email: 'thomas@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', value: 16, label: 'Thomas Martinez', name: 'Thomas Martinez' },
  { id: 17, email: 'barbara@example.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', value: 17, label: 'Barbara Hernandez', name: 'Barbara Hernandez' },
  { id: 18, email: 'christopher@example.com', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face', value: 18, label: 'Christopher Lopez', name: 'Christopher Lopez' },
  { id: 19, email: 'elizabeth@example.com', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', value: 19, label: 'Elizabeth Gonzalez', name: 'Elizabeth Gonzalez' },
  { id: 20, email: 'daniel@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', value: 20, label: 'Daniel Perez', name: 'Daniel Perez' },
  { id: 21, email: 'matthew@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', value: 21, label: 'Matthew Sanchez', name: 'Matthew Sanchez' },
  { id: 22, email: 'jessica@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', value: 22, label: 'Jessica Ramirez', name: 'Jessica Ramirez' },
  { id: 23, email: 'anthony@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', value: 23, label: 'Anthony Torres', name: 'Anthony Torres' },
  { id: 24, email: 'michael@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', value: 24, label: 'Michael Flores', name: 'Michael Flores' }
];
