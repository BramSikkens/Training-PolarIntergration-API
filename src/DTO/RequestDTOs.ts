export interface CreateTeamDto {
  groupName: string;
  trainerId: string | number;
}

export interface ReturnTeamDto {
  id: string;
  groupName: string;
  trainer: string;
  users: string[];
}

export interface CreateUserDTO {
  username: string;
  email: string;
  dateOfBirth: string;
  club: string;
}

export interface ReturnUserDto {
  id: string;
  username: string;
  email: string;
  dateOfBirth: string;
  club: string;
  type?: string;

}

export interface ReturnTrainerDto extends ReturnUserDto {
  teams: string[];
}
