import express from 'express';
import Producto from '../models/Producto.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

router.get('/:id', async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

router.post('/buscar', async (req, res) => {
  const { categoria, precio_min, precio_max, destacado } = req.body;
  const filtro = {};
  if (categoria) filtro.categoria = categoria;
  if (precio_min || precio_max) {
    filtro.precio = {};
    if (precio_min) filtro.precio.$gte = precio_min;
    if (precio_max) filtro.precio.$lte = precio_max;
  }
  if (typeof destacado === 'boolean') filtro.destacado = destacado;
  const productos = await Producto.find(filtro);
  res.json(productos);
});

router.post('/', async (req, res) => {
  const { nombre, desc, precio, imagen, categoria, stock, destacado } = req.body;
  if (!nombre || !desc || !precio || !categoria) {
    return res.status(400).json({ error: 'Nombre, desc, precio y categoria son requeridos' });
  }
  const producto = await Producto.create({ nombre, desc, precio, imagen: imagen || null, categoria, stock: stock || 0, destacado: destacado || false });
  res.status(201).json(producto);
});

router.put('/:id', async (req, res) => {
  const { nombre, desc, precio, imagen, categoria, stock, destacado } = req.body;
  const update = {};
  if (nombre) update.nombre = nombre;
  if (desc) update.desc = desc;
  if (precio) update.precio = precio;
  if (imagen) update.imagen = imagen;
  if (categoria) update.categoria = categoria;
  if (typeof stock === 'number') update.stock = stock;
  if (typeof destacado === 'boolean') update.destacado = destacado;

  const producto = await Producto.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

export default router;
