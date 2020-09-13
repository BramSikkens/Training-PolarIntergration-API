import Event from "../entity/Event";
import BaseService from "./BaseService";
import { getRepository, Repository } from "typeorm";

export default class EventService extends BaseService<Event> {
  constructor(model: any) {
    super(model);
  }

  async getEventsOfUser(_userIds: any): Promise<any> {
    const repository: Repository<Event> = getRepository(this.model);
    try {
      const events = await repository
        .createQueryBuilder("event")
        .innerJoinAndSelect(
          "event.users",
          "eventUsers",
          "eventUsers.id IN (:userIds)",
            {
            userIds: _userIds,
          }
        )
        .getMany();

      return events;
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        message: error.errmsg || "Not able to create item",
        errors: error.errors,
      };
    }
  }

  async updateEventFull(id: string, event: any): Promise<Event | any> {
    try {
      const result = await this.update(id, event);
      if (result) {
        return result;
      }
    } catch (error) {

      return {
        error: true,
        statusCode: 400,
        message: error.errmsg || "Could not update Item",
        errors: error.errors,
      };
    }
  }
}
