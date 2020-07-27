import BaseService from "./BaseService";
import Event from "../entity/Event";

export default class EventService extends BaseService<Event> {
  constructor(model: any) {
    super(model);
  }
}
