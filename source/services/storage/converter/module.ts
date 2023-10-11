export interface ConverterParams {
  from: string,
  dist: string,
}

export class Converter {

  constructor(public params: ConverterParams) {
    
  }

}