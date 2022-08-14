import { formatErrors } from "./formatErrors";
import { schema } from "./schema";
const schemaParseResult = schema.safeParse(process.env);
if (!schemaParseResult.success) {
    console.error("❌ Invalid environment variables:\n", ...formatErrors(schemaParseResult.error.format()));
    throw new Error("Invalid environment variables");
}
export const env = schemaParseResult.data;
