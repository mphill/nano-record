import NodeAdapter from "../../node/adapter";
import z from 'zod'
import server from "../../server/app";

const adapter = new NodeAdapter("./");


const cards = z.object({
    name: z.string(),
    year: z.number(),
    graded: z.boolean(),
    grade: z.number(),
    value: z.number(),
    league: z.enum(["mlb", "nba", "nfl", "nhl"]),
    vintage: z.boolean(),
    manufacturer: z.enum(["topps", "panini", "upperdeck", "donruss", "bowman", "fleer", "score", "prizm", "other"]),

});

server(adapter, 3000, {
    "cards": {
        schema: cards
    }
});


