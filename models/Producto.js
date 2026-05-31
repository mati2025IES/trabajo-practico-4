import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  desc: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String, default: null },
  categoria: { type: String, required: true },
  stock: { type: Number, default: 0 },
  destacado: { type: Boolean, default: false }
});

export default mongoose.model('Producto', productoSchema);
