import express from 'express';
import { ZodType } from "express-zod-api/dist/extend-zod";
import bodyParser from 'body-parser';
import NanoRecord from "../core/nanorecord";
import { Adapter } from '@nano-record/core/adapter';
import z from 'zod'
import morgan from 'morgan';

const app = express();

// create a route dictionary with a string key and ZodType validation
interface CollectionRoute {
    [key: string]: {
        schema: ZodType
    }
}

const server = async (adapter: Adapter, port: number, endpoints: CollectionRoute) => {

    const nano = new NanoRecord(adapter);

    app.use(bodyParser.json())

    app.use(function(req, res, next) {
        console.log(req.method, req.url);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    for (const endpoint in endpoints) {

        const schema = endpoints[endpoint];

        const instance = await nano.collection<z.infer<typeof schema.schema>>(endpoint);

        console.log(`GET /${endpoint}`);

        app.get(`/${endpoint}`, (req, res) => {
            res.send(instance.findMany());
        });

        console.log(`GET /${endpoint}/:id`);

        app.get(`/${endpoint}/:id`, async (req, res) => {
            const result = await instance.findFirst(t => t.id == req.params.id);
            if (result) {
                res.send(result);
            } else {
                res.status(404).send();
            }

        });

        console.log(`POST /${endpoint}`);

        app.post(`/${endpoint}`, async (req, res) => {
            const validation = schema.schema.safeParse(req.body) as any;

            if (validation.success) {
                const identifiable = Object.assign(req.body, { id: instance.makeId() });
                await instance.create(identifiable);
                res.status(201).send(identifiable);
            } else {
                res.status(422).send(validation.error.issues);
            }
        });

        console.log(`DELETE /${endpoint}/:id`);

        app.delete(`/${endpoint}/:id`, async (req, res) => {
            const result = await instance.deleteFirst(v => v.id == req.params.id);

            if (result) {
                res.status(204).send();
            } else {
                res.status(404).send();
            }
        });

        console.log(`PUT /${endpoint}/:id`);

        app.put(`/${endpoint}/:id`, async (req, res) => {
            const validation = schema.schema.safeParse(req.body) as any;

            if (validation.success) {
                const identifiable = Object.assign(req.body, { id: req.params.id });
                const result = await instance.updateFirst(v => v.id == req.params.id, identifiable);
                if (result) {
                    res.status(200).send(identifiable);
                } else {
                    res.status(404).send();
                }
            } else {
                res.status(422).send(validation.error.issues);
            }
        });
    };

    app.listen(port, () => {
        console.log(`Nano Server listening on port ${port}`)
    });
};

export default server;