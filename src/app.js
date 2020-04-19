const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).send();

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex == -1) return response.status(400).send();

  return next();  
}

app.get("/repositories", (request, response) => {
  return response.json(repositories).send();
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();
  const repository = { id, title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  const repository = repositories[repositoryIndex];
  const newRepository = { id, title, url, techs, likes: repository.likes };
  repositories.splice(repositoryIndex, 1, newRepository);

  return response.json(newRepository);
});

app.delete("/repositories/:id", validId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  repositories[repositoryIndex].likes += 1;

  const likes = repositories[repositoryIndex].likes;
  return response.json({ likes });
});

module.exports = app;
