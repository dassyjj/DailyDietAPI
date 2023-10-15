import { Database } from "../database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "../utils/build-route-path.js";

const database = new Database();

export const routes = [
  // {
  //   method: "GET",
  //   path: buildRoutePath("/users"),
  //   handler: (req, res) => {
  //     const { search } = req.query;

  //     const users = database.select(
  //       "users",
  //       search
  //         ? {
  //             name: search,
  //             email: search,
  //           }
  //         : null
  //     );

  //     return res.end(JSON.stringify(users));
  //   },
  // },
  {
    method: "PUT",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { name, email, password } = req.body;
      database.update("users", req.params.id, name, email, password);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      database.delete("users", req.params.id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/register"),
    handler: (req, res) => {
      const { name, email, password } = req.body;

      if (name && email && password) {
        const users = database.select("users", {
          name,
          email,
        });

        const checkParameters =
          users.find((row) => row.name === name || row.email === email) ?? [];

        if (checkParameters.name === name) {
          return res
            .writeHead(400)
            .end(JSON.stringify({ message: "This name already exists" }));
        }

        if (checkParameters.email === email) {
          return res
            .writeHead(400)
            .end(JSON.stringify({ message: "This email already exists" }));
        }

        if (checkParameters.name != name && checkParameters.email != email) {
          database.insert("users", {
            id: randomUUID(),
            name,
            email,
            password,
          });
          return res
            .writeHead(200)
            .end(JSON.stringify({ message: "registered" }));
        }
      }
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/login"),
    handler: (req, res) => {
      const { name, password } = req.body;

      if (name && password) {
        const users = database.select("users", {
          name,
          password,
        });

        const checkParameters =
          users.find((row) => row.name === name && row.password === password) ??
          [];
        if (checkParameters.name && checkParameters.password) {
          return res
            .writeHead(200)
            .end(JSON.stringify({ token: checkParameters.id }));
        }

        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Email or password are incorrect" }));
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/snack/:id"),
    handler: (req, res) => {
      const { name, description, diet } = req.body;

      if (req.params.id) {
        const users = database.select("users", {
          id: req.params.id,
        });

        const snack = {
          id: randomUUID(),
          name,
          description,
          diet,
          date: new Date(),
        };

        database.insertSnack("snacks", users[0].id, snack);

        return res.writeHead(201).end();
      }

      res.writeHead(400).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/snack/:id"),
    handler: (req, res) => {
      const { snackID, name, description, diet } = req.body;

      const snack = {
        id: snackID,
        name,
        description,
        diet,
        date: new Date(),
      };
      database.updateSnack("snacks", req.params.id, snackID, snack);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/snack/:id"),
    handler: (req, res) => {
      const { snackID } = req.body;
      database.deleteSnack("snacks", req.params.id, snackID);

      return res.writeHead(204).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/snack/:id"),
    handler: (req, res) => {
      const { snackID } = req.body ?? false
      const data = database.select("snacks", { id: req.params.id });

      if (data) {
        if (!!snackID) {
          const snack = data.map((row) =>
            row.snacks.find((row) => row.id === snackID)
          );
          return res.writeHead(200).end(JSON.stringify(snack));
        } else {
          const snack = data.map((row) => row.snacks);

          return res.writeHead(200).end(JSON.stringify(snack));
        }
      } else {
        return res.writeHead(400).end();
      }
    },
  },
];
