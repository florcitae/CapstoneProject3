import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Añadir extensión del archivo
    }
});

const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var recetas = [
    {
        id: 1,
        titulo:"Tiramisu",
        categorias:"Postre",
        image:"imagenes/tiramisu.jpg",
        descripcion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        paso:["lorem ipsum", "lorem ipsum"],
        ingrediente: ["lorem ipsum", "lorem ipsum"],
        creadaUsuario: false

    },
    {
        id: 2,
        titulo:"Tiramisu",
        categorias:"Postre",
        image:"imagenes/tiramisu.jpg",
        descripcion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        paso:["lorem ipsum", "lorem ipsum"],
        ingrediente: ["lorem ipsum", "lorem ipsum"],
        creadaUsuario: false

    },
    {
        id: 3,
        titulo:"Tiramisu",
        categorias:"Postre",
        image:"imagenes/tiramisu.jpg",
        descripcion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        paso:["lorem ipsum", "lorem ipsum"],
        ingrediente: ["lorem ipsum", "lorem ipsum"],
        creadaUsuario: false

    },
    {
        id: 4,
        titulo:"Tiramisu",
        categorias:"Postre",
        image:"imagenes/tiramisu.jpg",
        descripcion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        paso:["lorem ipsum", "lorem ipsum"],
        ingrediente: ["lorem ipsum", "lorem ipsum"],
        creadaUsuario: false

    }
]

app.get("/", (req, res) => {
    res.render("index.ejs", { recetas: recetas });
});

// Ruta para la receta individual
app.get("/receta/:id", (req, res) => {
    const recetaId = req.params.id;
    const receta = recetas.find(r => r.id == recetaId);
    if (receta) {
        res.render("receta", { receta: receta });
    } else {
        res.status(404).send("Receta no encontrada");
    }
});

// Ruta del formulario
app.get("/formularioReceta", (req, res) => {
    res.render("formularioReceta.ejs");
});

app.get("/misRecetas", (req, res) => {
    const misRecetas = recetas.filter(receta => receta.creadaUsuario);
    res.render("misRecetas.ejs", {recetas: misRecetas});
})

app.get("/eliminar-receta", (req, res) => {
    const id = req.query.id;
    recetas = recetas.filter(receta => receta.id != id);
    res.redirect('/');
});

app.post('/formularioReceta', upload.single('image'), (req, res) => {
    const {titulo, descripcion, categorias, paso, ingrediente } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : '';

    console.log('Nueva receta recibida:', {titulo, descripcion, categorias, pasos: paso, ingredientes: ingrediente, image });

    const nuevaReceta = { id: recetas.length + 1, titulo, descripcion, categorias, paso: paso, ingrediente: ingrediente, image, creadaUsuario:true};
    recetas.push(nuevaReceta);

    res.redirect('/');
});

app.get("/formularioEditarReceta", (req, res) => {
    const id = req.query.id;
    res.render("formularioEditarReceta.ejs", {
        receta: recetas[id-1]
    });
});

app.post("/editar-receta", (req, res) => {
    console.log(req.body);
    const receta = recetas.find(r => r.id === parseInt(req.body.id));
  
    // Actualiza los campos de la receta con los datos recibidos del formulario
    receta.titulo = req.body.titulo;
    receta.categorias = req.body.categorias;
    receta.descripcion = req.body.descripcion;
    receta.paso = req.body.paso;
    receta.ingrediente = req.body.ingrediente;
  
    res.redirect('/');
  });


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});