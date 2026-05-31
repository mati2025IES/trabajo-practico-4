import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Producto from './models/Producto.js';
import Usuario from './models/Usuario.js';

const productos = [
  { nombre: "Void Behemoth Battleship", desc: "Modelo de nave espacial impreso en 3D con gran nivel de detalle.", precio: 1500, imagen: "/imagenes/barco.webp", categoria: "figuras", stock: 10, destacado: true },
  { nombre: "Mecha YJ-20", desc: "Robot articulado inspirado en el universo sci-fi.", precio: 2500, imagen: "/imagenes/robot.webp", categoria: "figuras", stock: 7, destacado: true },
  { nombre: "Miniatura Alien Hunter", desc: "Figura coleccionable pintada a mano.", precio: 1800, imagen: "/imagenes/alien.webp", categoria: "figuras", stock: 15, destacado: false },
  { nombre: "Moto GP Ducati", desc: "Réplica 3D de moto de carreras, ideal para fanáticos del motociclismo.", precio: 2200, imagen: "/imagenes/moto.webp", categoria: "vehiculos", stock: 5, destacado: false },
  { nombre: "Auto F1 Red Thunder", desc: "Coche de fórmula 1 en miniatura impreso capa por capa.", precio: 2100, imagen: "/imagenes/auto.webp", categoria: "vehiculos", stock: 3, destacado: true },
  { nombre: "Maceta geométrica", desc: "Decoración moderna impresa en PLA reciclado.", precio: 1200, imagen: "/imagenes/maceta.webp", categoria: "decoracion", stock: 20, destacado: false },
  { nombre: "Lámpara lunar", desc: "Reproduce la textura de la luna, con luz LED interior.", precio: 3500, imagen: "/imagenes/lampara.webp", categoria: "decoracion", stock: 6, destacado: true }
];

const usuarios = [
  { nombre: "Lucía", apellido: "Fernández", email: "lucia.fernandez@email.com", contraseña: "Lucia2024!", activo: true, edad: 28 },
  { nombre: "Martín", apellido: "González", email: "martin.gonzalez@email.com", contraseña: "MartinG99#", activo: true, edad: 34 },
  { nombre: "Camila", apellido: "López", email: "camila.lopez@email.com", contraseña: "CamiLop!56", activo: false, edad: 22 },
  { nombre: "Santiago", apellido: "Ramírez", email: "santiago.ramirez@email.com", contraseña: "SantiR_2023", activo: true, edad: 41 },
  { nombre: "Valentina", apellido: "Torres", email: "valentina.torres@email.com", contraseña: "ValeTorr#88", activo: true, edad: 30 }
];

await mongoose.connect(process.env.MONGO_URI);

await Producto.deleteMany();
await Producto.insertMany(productos);
console.log('Productos insertados');

await Usuario.deleteMany();
for (const u of usuarios) {
  u.contraseña = await bcrypt.hash(u.contraseña, 10);
  await Usuario.create(u);
}
console.log('Usuarios insertados con contraseñas encriptadas');

await mongoose.disconnect();
console.log('Seed completado');
