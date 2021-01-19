const { io } = require('../index');
const Band = require('../models/band');
const Bands  = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band('Queen'));
bands.addBand( new Band('Bon Jovi'));
bands.addBand( new Band('Heroes del Silencio'));
bands.addBand( new Band('Metallica'));

// console.log(bands);


//Mensajes de Sockets
io.on('connection', client => {

    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () =>{
        console.log('Cliente desconectado');
    });

    //Emitir mensaje
    // client.on('emitir-mensaje', ( payload ) => {

    //     //Se emite a todos
    //     // io.emit('nuevo-mensaje', payload);

    //     //Se emite a todos menos al que emitió
    //     client.broadcast.emit('nuevo-mensaje', payload);

    // });

    client.on('vote-band', (payload) => {

        bands.voteBand( payload.id );

        io.emit('active-bands', bands.getBands());

    });

    client.on('add-band', (payload) =>{

        // console.log(payload);

        var band = new Band(payload.name);

        bands.addBand(band);

        io.emit('active-bands', bands.getBands());


    });

    client.on('delete-band', (payload) =>{
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
});