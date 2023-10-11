import { author } from "../../schemas/entities/author.schema.ts"

export class Author implements author.struct {

  public firstname = String();
  public lastname = String();
  public id = String();

  constructor(struct: author.struct) {
    Object.assign(this, struct);
  }

}