import { GlobalFonts } from "@napi-rs/canvas";
import fs from "fs/promises";

import { createImage } from "./createImage.js";

GlobalFonts.loadFontsFromDir("./fonts");

const pngData = await createImage(400, "epiku");
await fs.writeFile("test.png", pngData).catch(err => console.error(err));
