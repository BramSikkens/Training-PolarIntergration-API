import Event from "../entity/Event";
import BaseService from "./BaseService";

export default class EventService extends BaseService<Event> {
  constructor(model: any) {
    super(model);
  }
}
