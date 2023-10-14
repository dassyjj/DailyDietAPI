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
  // {
  //   method: "POST",
  //   path: buildRoutePath("/users"),
  //   handler: (req, res) => {
  //     const { name, email } = req.body;

  //     const user = {
  //       id: randomUUID(),
  //       name,
  //       email,
  //     };

  //     database.insert("users", user);

  //     return res.writeHead(201).end();
  //   },
  // },
  // {
  //   method: "PUT",
  //   path: buildRoutePath("/users/:id"),
  //   handler: (req, res) => {
  //     const { name, email } = req.body;
  //     database.update("users", req.params.id, name, email);

  //     return res.writeHead(204).end();
  //   },
  // },
  // {
  //   method: "DELETE",
  //   path: buildRoutePath("/users/:id"),
  //   handler: (req, res) => {
  //     database.delete("users", req.params.id);

  //     return res.writeHead(204).end();
  //   },
  // },
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

        const checkParameters = users.find((row) => row.name === name || row.email === email) ?? [];

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
      const { name, password } = req.body

      if (name && password) {
        const users = database.select('users', {
          name,
          password
        })

        const checkParameters = users.find((row) => row.name === name && row.password === password) ?? [];
        if (checkParameters.name && checkParameters.password) {
          return res
            .writeHead(200)
            .end(JSON.stringify({ message: "Logged" }));
        }

        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Email or password are incorrect" }));
      }
    }
  },
];
