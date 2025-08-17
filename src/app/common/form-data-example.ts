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
  username: string;
  email: string;
  avatar: string;
  value: string;
  label: string;
}

export const usersChoices: User[] = [
  { id: 1, username: 'Scott', email: 'scott@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', value: '1', label: 'Scott' },
  { id: 2, username: 'Mike', email: 'mike@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', value: '2', label: 'Mike' },
  { id: 3, username: 'Emma', email: 'emma@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', value: '3', label: 'Emma' },
  { id: 4, username: 'John', email: 'john@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', value: '4', label: 'John' },
  { id: 5, username: 'Lisa', email: 'lisa@example.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', value: '5', label: 'Lisa' },
  { id: 6, username: 'David', email: 'david@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', value: '6', label: 'David' },
  { id: 7, username: 'Anna', email: 'anna@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', value: '7', label: 'Anna' },
  { id: 8, username: 'James', email: 'james@example.com', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face', value: '8', label: 'James' },
  { id: 9, username: 'Maria', email: 'maria@example.com', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', value: '9', label: 'Maria' },
  { id: 10, username: 'Robert', email: 'robert@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', value: '10', label: 'Robert' },
  { id: 11, username: 'Jennifer', email: 'jennifer@example.com', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face', value: '11', label: 'Jennifer' },
  { id: 12, username: 'William', email: 'william@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', value: '12', label: 'William' },
  { id: 13, username: 'Linda', email: 'linda@example.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', value: '13', label: 'Linda' },
  { id: 14, username: 'Richard', email: 'richard@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', value: '14', label: 'Richard' },
  { id: 15, username: 'Patricia', email: 'patricia@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', value: '15', label: 'Patricia' },
  { id: 16, username: 'Thomas', email: 'thomas@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', value: '16', label: 'Thomas' },
  { id: 17, username: 'Barbara', email: 'barbara@example.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', value: '17', label: 'Barbara' },
  { id: 18, username: 'Christopher', email: 'christopher@example.com', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face', value: '18', label: 'Christopher' },
  { id: 19, username: 'Elizabeth', email: 'elizabeth@example.com', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', value: '19', label: 'Elizabeth' },
  { id: 20, username: 'Daniel', email: 'daniel@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', value: '20', label: 'Daniel' },
  { id: 21, username: 'Matthew', email: 'matthew@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', value: '21', label: 'Matthew' },
  { id: 22, username: 'Jessica', email: 'jessica@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', value: '22', label: 'Jessica' },
  { id: 23, username: 'Anthony', email: 'anthony@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', value: '23', label: 'Anthony' },
  { id: 24, username: 'Michael', email: 'michael@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', value: '24', label: 'Michael' }
];
