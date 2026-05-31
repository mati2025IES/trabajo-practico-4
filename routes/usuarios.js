import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const router = express.Router();
const SALT_ROUNDS = 10;

router.get('/', async (req, res) => {
  const usuarios = await Usuario.find().select('-contraseña');
  res.json(usuarios);
});

router.get('/:id', async (req, res) => {
  const usuario = await Usuario.findById(req.params.id).select('-contraseña');
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
});

router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;
  if (!email || !contraseña) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

  const usuario = await Usuario.findOne({ email });
  if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

  const valida = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!valida) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
  const { contraseña: _, ...datos } = usuario.toObject();
  res.json({ token, usuario: datos });
});

router.post('/', async (req, res) => {
  const { nombre, apellido, email, contraseña, edad } = req.body;
  if (!nombre || !apellido || !email || !contraseña) {
    return res.status(400).json({ error: 'Nombre, apellido, email y contraseña son requeridos' });
  }

  const existe = await Usuario.findOne({ email });
  if (existe) return res.status(409).json({ error: 'El email ya está registrado' });

  const hash = await bcrypt.hash(contraseña, SALT_ROUNDS);
  const usuario = await Usuario.create({ nombre, apellido, email, contraseña: hash, edad: edad || null });
  const { contraseña: _, ...datos } = usuario.toObject();
  res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: datos });
});

router.put('/:id', async (req, res) => {
  const { nombre, apellido, email, contraseña, activo, edad } = req.body;
  const update = {};
  if (nombre) update.nombre = nombre;
  if (apellido) update.apellido = apellido;
  if (email) update.email = email;
  if (contraseña) update.contraseña = await bcrypt.hash(contraseña, SALT_ROUNDS);
  if (typeof activo === 'boolean') update.activo = activo;
  if (edad) update.edad = edad;

  const usuario = await Usuario.findByIdAndUpdate(req.params.id, update, { new: true }).select('-contraseña');
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ mensaje: 'Usuario actualizado correctamente', usuario });
});

router.delete('/:id', async (req, res) => {
  const usuario = await Usuario.findByIdAndDelete(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ mensaje: 'Usuario eliminado correctamente' });
});

export default router;
