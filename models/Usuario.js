import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  edad: { type: Number, default: null },
  activo: { type: Boolean, default: true }
});

export default mongoose.model('Usuario', usuarioSchema);
