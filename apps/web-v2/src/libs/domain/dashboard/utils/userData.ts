// User class order as specified
const USER_CLASS_ORDER = [
  'Int - SC $',
  'Int - SSC $',
  'Int - RSL $',
  'Int - Disabled SC',
  'Int - Disabled SSC',
  'Bank Partner $',
  'ISV Full Serv $',
  'ISV Full Serv',
  'Reseller Full Serv $',
  'Reseller Par Serv $',
  'Reseller Tal Serv $',
  'Referral Partners $',
  'Disabled-Partner',
];

export interface User {
  id: string;
  name: string;
  userClass: string;
  group: 'Partner' | 'Direct' | 'F1 - City National' | 'Inside Sales';
}

// Mock users data - grouped by Group
export const MOCK_USERS: User[] = [
  // Partner Group
  { id: '1', name: 'John Smith', userClass: 'Int - SC $', group: 'Partner' },
  { id: '2', name: 'Jane Doe', userClass: 'Int - SSC $', group: 'Partner' },
  { id: '3', name: 'Bob Johnson', userClass: 'Int - RSL $', group: 'Partner' },
  { id: '4', name: 'Alice Williams', userClass: 'Bank Partner $', group: 'Partner' },
  { id: '5', name: 'Charlie Brown', userClass: 'ISV Full Serv $', group: 'Partner' },
  { id: '6', name: 'Diana Prince', userClass: 'Reseller Full Serv $', group: 'Partner' },
  { id: '7', name: 'Edward Norton', userClass: 'Referral Partners $', group: 'Partner' },
  
  // Direct Group
  { id: '8', name: 'Frank Miller', userClass: 'Int - SC $', group: 'Direct' },
  { id: '9', name: 'Grace Kelly', userClass: 'Int - SSC $', group: 'Direct' },
  { id: '10', name: 'Henry Ford', userClass: 'Int - RSL $', group: 'Direct' },
  { id: '11', name: 'Iris Watson', userClass: 'Int - Disabled SC', group: 'Direct' },
  { id: '12', name: 'Jack London', userClass: 'Int - Disabled SSC', group: 'Direct' },
  { id: '13', name: 'Karen White', userClass: 'ISV Full Serv', group: 'Direct' },
  { id: '14', name: 'Larry King', userClass: 'Reseller Par Serv $', group: 'Direct' },
  
  // F1 - City National Group
  { id: '15', name: 'Mary Johnson', userClass: 'Int - SC $', group: 'F1 - City National' },
  { id: '16', name: 'Nancy Davis', userClass: 'Int - SSC $', group: 'F1 - City National' },
  { id: '17', name: 'Oliver Twist', userClass: 'Bank Partner $', group: 'F1 - City National' },
  { id: '18', name: 'Patricia Brown', userClass: 'ISV Full Serv $', group: 'F1 - City National' },
  
  // Inside Sales Group
  { id: '19', name: 'Quinn Taylor', userClass: 'Int - SC $', group: 'Inside Sales' },
  { id: '20', name: 'Rachel Green', userClass: 'Int - SSC $', group: 'Inside Sales' },
  { id: '21', name: 'Steve Jobs', userClass: 'Int - RSL $', group: 'Inside Sales' },
  { id: '22', name: 'Tina Turner', userClass: 'Reseller Tal Serv $', group: 'Inside Sales' },
  { id: '23', name: 'Uma Thurman', userClass: 'Disabled-Partner', group: 'Inside Sales' },
];

// Helper function to get users by group, sorted by user class order
export function getUsersByGroup(group: string | 'all'): User[] {
  const users = group === 'all' 
    ? MOCK_USERS 
    : MOCK_USERS.filter(u => u.group === group);
  
  // Sort by user class order
  return users.sort((a, b) => {
    const indexA = USER_CLASS_ORDER.indexOf(a.userClass);
    const indexB = USER_CLASS_ORDER.indexOf(b.userClass);
    
    // If class not found in order, put at end
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });
}

// Helper function to get unique groups
export function getGroups(): string[] {
  return ['Partner', 'Direct', 'F1 - City National', 'Inside Sales'];
}

// Helper function to get unique user classes (in order)
export function getUserClasses(): string[] {
  return [...USER_CLASS_ORDER];
}

// Helper function to get user by ID
export function getUserById(userId: string): User | undefined {
  return MOCK_USERS.find(u => u.id === userId);
}

// Helper function to get group by user ID
export function getGroupByUserId(userId: string): string | undefined {
  const user = getUserById(userId);
  return user?.group;
}

