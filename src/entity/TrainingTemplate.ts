import { ChildEntity } from "typeorm";
import Training from "./Training";

@ChildEntity()
export default class TrainingTemplate extends Training {}
