import {createApp} from './app.js';

const PORT = parseInt(process.env.PORT ?? '3000', 10);
const app = createApp();

// Guardamos la referencia al servidor para poder cerrarlo limpiamente
const server = app.listen(PORT, () => {
	console.log(`Servidor corriendo y escuchando en http://localhost:${PORT}`);
}); 

// Graceful shutdown — cierra el servidor limpiamente ante señales del sistema
process.on('SIGTERM', () => {
	console.log('SIGTERM recibido, cerrado servidor. . .');
	server.close(() => {
		console.log('Servidor cerrado correctamente');
		process.exit(0)
	});
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
});
