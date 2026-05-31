import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import usuariosRouter from './routes/usuarios.js';
import productosRouter from './routes/productos.js';
import ventasRouter from './routes/ventas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => { console.error('Error conectando a MongoDB:', err); process.exit(1); });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/ventas', ventasRouter);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
