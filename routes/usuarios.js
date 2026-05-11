import express from 'express';
import { leerJSON, escribirJSON } from '../utils/dataHandler.js';

const router = express.Router();

router.get('/', (req, res) => {
  const usuarios = leerJSON('usuarios.json');
  const sinPassword = usuarios.map(({ contraseña, ...resto }) => resto);
  res.json(sinPassword);
});

router.get('/:id', (req, res) => {
  const usuarios = leerJSON('usuarios.json');
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  const { contraseña, ...sinPassword } = usuario;
  res.json(sinPassword);
});

router.post('/login', (req, res) => {
  const { email, contraseña } = req.body;
  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }
  const usuarios = leerJSON('usuarios.json');
  const usuario = usuarios.find(u => u.email === email && u.contraseña === contraseña);
  if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
  const { contraseña: _, ...sinPassword } = usuario;
  res.json({ mensaje: 'Login exitoso', usuario: sinPassword });
});

router.post('/', (req, res) => {
  const { nombre, apellido, email, contraseña, edad } = req.body;
  if (!nombre || !apellido || !email || !contraseña) {
    return res.status(400).json({ error: 'Nombre, apellido, email y contraseña son requeridos' });
  }
  const usuarios = leerJSON('usuarios.json');
  const emailExiste = usuarios.find(u => u.email === email);
  if (emailExiste) return res.status(409).json({ error: 'El email ya está registrado' });

  const nuevoUsuario = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
    nombre,
    apellido,
    email,
    contraseña,
    activo: true,
    edad: edad || null
  };
  usuarios.push(nuevoUsuario);
  escribirJSON('usuarios.json', usuarios);
  const { contraseña: _, ...sinPassword } = nuevoUsuario;
  res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: sinPassword });
});

router.put('/:id', (req, res) => {
  const usuarios = leerJSON('usuarios.json');
  const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { nombre, apellido, email, contraseña, activo, edad } = req.body;
  if (nombre) usuarios[index].nombre = nombre;
  if (apellido) usuarios[index].apellido = apellido;
  if (email) usuarios[index].email = email;
  if (contraseña) usuarios[index].contraseña = contraseña;
  if (typeof activo === 'boolean') usuarios[index].activo = activo;
  if (edad) usuarios[index].edad = edad;

  escribirJSON('usuarios.json', usuarios);
  const { contraseña: _, ...sinPassword } = usuarios[index];
  res.json({ mensaje: 'Usuario actualizado correctamente', usuario: sinPassword });
});

router.delete('/:id', (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const usuarios = leerJSON('usuarios.json');
  const index = usuarios.findIndex(u => u.id === idUsuario);
  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

  const ventas = leerJSON('ventas.json');
  const ventasAsociadas = ventas.filter(v => v.id_usuario === idUsuario);
  if (ventasAsociadas.length > 0) {
    return res.status(409).json({
      error: 'No se puede eliminar el usuario porque tiene ventas asociadas',
      ventas_asociadas: ventasAsociadas.map(v => v.id)
    });
  }

  usuarios.splice(index, 1);
  escribirJSON('usuarios.json', usuarios);
  res.json({ mensaje: 'Usuario eliminado correctamente' });
});

export default router;
