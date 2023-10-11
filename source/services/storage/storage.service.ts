import sharp from "sharp";
import { SERVICES } from "../services.enum.ts";

import { Converter } from "./converter/module.ts"

export interface StorageParams {
  port  : number,
  cache : number,
  root  : string
}

export class StorageService {

  private tag: SERVICES.STORAGE = SERVICES.STORAGE;

  private converter: Converter;
 
  constructor(params: StorageParams) {
  
    this.converter = new Converter({ 
      from: params.root + "/assets", 
      dist: params.root + "/converted" 
    });

    try {

      Deno.mkdirSync(this.converter.params.dist);
      Deno.mkdirSync(this.converter.params.from);

    } catch(e) {};

    console.log(`info: ${ this.constructor.name } is running on ${ params.port } port`);

  }

}