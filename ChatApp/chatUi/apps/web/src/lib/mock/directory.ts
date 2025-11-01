import { User } from "../../types";
import { mockUsers } from "./data";

export const mockDirectoryService = {
  async listMembers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [...mockUsers];
  },
  
  async getMember(userId: string): Promise<User | undefined> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return mockUsers.find(u => u.id === userId);
  }
};
