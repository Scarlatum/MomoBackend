import "https://deno.land/x/dotenv@v3.2.2/load.ts"

var temp: any = 0;

export const DATABASE_PORT: number = Number.isNaN(temp = parseInt(String(Deno.env.get("DATABASE_PORT"))))
  ? 8000
  : temp

export const STORAGE_PORT: number = Number.isNaN(temp = parseInt(String(Deno.env.get("STORAGE_PORT"))))
  ? 8050
  : temp

export const STORAGE_FOLDER_NAME = Deno.env.get("STORAGE_ASSET_FOLDER_NAME") || "storage";

try { Deno.mkdirSync(`./${ STORAGE_FOLDER_NAME }`) } catch(e) {};