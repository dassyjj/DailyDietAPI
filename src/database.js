import fs from "node:fs/promises";

const databasePath = new URL("../database/db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
  }

  update(table, id, name, email, password) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, name, email, password };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  insertSnack(table, id, newSnack) {
    if (Array.isArray(this.#database[table])) {
      const rowIndex = this.#database[table].findIndex((row) => row.id === id);

      if (rowIndex > -1) {
        this.#database[table][rowIndex].snacks.push(newSnack);
      } else {
        this.#database[table].push({
          id,
          snacks: [newSnack],
        });
      }
    } else {
      this.#database[table] = [
        {
          id,
          snacks: [newSnack],
        },
      ];
    }

    this.#persist();
  }

  updateSnack(table, userID, snackID, newSnack) {
    const user = this.#database[table].findIndex((row) => row.id === userID);
    const snack = this.#database[table][user].snacks.findIndex(
      (row) => row.id === snackID
    );

    if (snack > -1) {
      this.#database[table][user].snacks[snack] = newSnack;
      this.#persist();
    }
  }

  deleteSnack(table, userID, snackID) {
    const user = this.#database[table].findIndex((row) => row.id === userID);
    const snack = this.#database[table][user].snacks.findIndex(
      (row) => row.id === snackID
    );

    if (snack > -1) {
      this.#database[table][user].snacks.splice(snack, 1);
      this.#persist();
    }
  }
}
