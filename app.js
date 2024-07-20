import express from 'express';
import { createServer } from 'http';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

const app = express();
const appServer = createServer(app);
const io = new Server(appServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(express.static(join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.on('send-location', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        io.emit('user-disconnect', socket.id);
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

appServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});
