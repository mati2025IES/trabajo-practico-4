import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  direccion: { type: String, required: true },
  envio_express: { type: Boolean, default: false },
  productos: [
    {
      id_producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true }
    }
  ]
});

export default mongoose.model('Venta', ventaSchema);
