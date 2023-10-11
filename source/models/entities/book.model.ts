import { book } from "~/schemas/entities/book.schema.ts"

export class Book implements book.struct {

  public id = String();
  public tags = Array<string>();
  public chapters = Number();
  public title = String();

  constructor(struct: Readonly<book.struct>) {
    Object.assign(this, struct);
  }

  static get default(): book.struct {
    return {
      id        : String(),
      chapters  : Number(),
      tags      : Array(),
      title     : String(),
    }
  }

}