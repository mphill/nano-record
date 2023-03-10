import NodeAdapter from "../../node/adapter";
import z from 'zod'
import server from "../../server/app";

const adapter = new NodeAdapter("./");

const cards = z.object({
    id: z.string().optional(),
    name: z.string(),
    year: z.number().min(0),
    graded: z.boolean(),
    grade: z.number(),
    value: z.number(),
    league: z.enum(["mlb", "nba", "nfl", "nhl"]),
    vintage: z.boolean(),
    created: z.coerce.date(),
    manufacturer: z.enum(["topps", "panini", "upperdeck", "donruss", "bowman", "fleer", "score", "prizm", "other"])
});

server(adapter, 3000, {
    "cards": {
        schema: cards
    }
    },
    (express) => {
        express.use((req, res, next) => {
            // middlware Example
            next();
        });
    });