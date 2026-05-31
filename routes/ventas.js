import express from 'express';
import Venta from '../models/Venta.js';
import Producto from '../models/Producto.js';
import Usuario from '../models/Usuario.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const ventas = await Venta.find();
  res.json(ventas);
});

router.get('/:id', async (req, res) => {
  const venta = await Venta.findById(req.params.id);
  if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
  res.json(venta);
});

router.post('/por-usuario', async (req, res) => {
  const { id_usuario } = req.body;
  if (!id_usuario) return res.status(400).json({ error: 'id_usuario es requerido' });
  const ventas = await Venta.find({ id_usuario });
  res.json(ventas);
});

router.post('/', auth, async (req, res) => {
  const { direccion, envio_express, productos } = req.body;
  if (!direccion || !productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'direccion y productos (array) son requeridos' });
  }

  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  let total = 0;
  for (const item of productos) {
    const prod = await Producto.findById(item.id_producto);
    if (!prod) return res.status(404).json({ error: `Producto ${item.id_producto} no encontrado` });
    const cant = item.cantidad || 1;
    if (prod.stock < cant) return res.status(400).json({ error: `Stock insuficiente para "${prod.nombre}"` });
    total += prod.precio * cant;
  }

  for (const item of productos) {
    await Producto.findByIdAndUpdate(item.id_producto, { $inc: { stock: -(item.cantidad || 1) } });
  }

  const venta = await Venta.create({
    id_usuario: req.usuario.id,
    total,
    direccion,
    envio_express: envio_express || false,
    productos
  });

  res.status(201).json(venta);
});

router.put('/:id', async (req, res) => {
  const { direccion, envio_express } = req.body;
  const update = {};
  if (direccion) update.direccion = direccion;
  if (typeof envio_express === 'boolean') update.envio_express = envio_express;

  const venta = await Venta.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
  res.json(venta);
});

export default router;
