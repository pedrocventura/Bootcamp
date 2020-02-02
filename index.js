const express = require('express')
const server = express()
server.use(express.json())
var projects = [{ id: "0", title: "Projeto 0", tasks: [] }]
var contagem = 0;

//Middleware to count how many reqs were made
server.use((req, res, next) => {
  contagem++
  console.log(`Request until now: ${contagem}`)
  next()
})

//Middleware to verify if the requested project exists
function CheckProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

// Route to add a new project
server.post('/projects', (req, res) => {
  const { project } = req.body
  projects.push(project)
  return res.status(200).json({ message: "Success, the new project has been add" })
})

// Route to list all projects
server.get('/projects', (req, res) => {
  return res.json(projects)
})

// Route to change the title of the project
server.put('/projects/:id', CheckProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);
  project.title = title
  return res.json(projects)
})

//Route to delete a project
server.delete('/projects/:id', CheckProjectExists, (req, res) => {
  const { id } = req.params
  projects.splice(id, 1)
  return res.send()
})

//Route to add tasks to a project
server.put('/projects/:id/tasks', CheckProjectExists, (req, res) => {
  const { id } = req.params
  var { tasks } = req.body
  const project = projects.find(p => p.id == id);
  project.tasks.push(tasks)
  return res.json(projects)
})



server.listen(33300)