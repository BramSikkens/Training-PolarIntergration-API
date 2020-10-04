import { ReturnTrainerDto, ReturnUserDto } from "../DTO/RequestDTOs";
import Trainer from "../entity/Trainer";
import User from "../entity/User";

export function mapToTrainerDTO(trainer: Trainer): ReturnTrainerDto {
  const returnObject: ReturnTrainerDto = {
    id: trainer.id.toString(),
    username: trainer.username,
    email: trainer.email,
    dateOfBirth: trainer.dateOfBirth.toISOString(),
    club: trainer.club,
    type: "Trainer",
    teams: trainer.teams.map((team) => team.id.toString()),
  };
  return returnObject;
}

export function mapToUserDTO(user: User): ReturnUserDto {
  const returnObject: ReturnUserDto = {
    id: user.id.toString(),
    username: user.username,
    email: user.email,
    dateOfBirth: user.dateOfBirth.toISOString(),
    club: user.club,
    data: JSON.parse(user.data),
  };

  return returnObject;
}
