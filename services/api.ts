

export interface User {
  id: number;
  uid: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
}

/**
 * Fetches a specified number of random users from the API
 * @param size Number of users to fetch (default: 80)
 * @returns Promise with array of user objects
 */
export const fetchUsers = async (size: number = 80): Promise<User[]> => {
  try {
    const response = await fetch(`https://random-data-api.com/api/users/random_user?size=${size}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
