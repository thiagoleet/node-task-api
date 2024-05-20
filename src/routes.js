import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();
const context = "tasks";

export const routes = [
  {
    method: "GET",
    path: buildRoutePath(`/${context}`),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(context);
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath(`/${context}`),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            error:
              "Título e descrição são obrigatórios para a criação de uma tarefa",
          })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert(context, task);

      return res.writeHead(201).end(JSON.stringify(task));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath(`/${context}/:id`),
    handler: (req, res) => {
      const { id } = req.params;

      const found = database.delete(context, id);

      return res.writeHead(found ? 204 : 404).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath(`/${context}/:id`),

    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            error:
              "Título e descrição são obrigatórios para a atualização de uma tarefa",
          })
        );
      }

      const task = database.update(context, id, {
        title,
        description,
        updated_at: new Date(),
      });

      return res.writeHead(task ? 200 : 404).end(JSON.stringify(task));
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath(`/${context}/:id/complete`),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.update(context, id, {
        completed_at: new Date(),
        updated_at: new Date(),
      });

      return res.writeHead(task ? 200 : 404).end(JSON.stringify(task));
    },
  },
];
