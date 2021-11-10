const byId = id => document.getElementById(id);

let Peer,
    peer1,
    peer2,
    worked,

    browser,
    ver,
    os;

function bootstrap() {

  Peer  = window.SimplePeer;

  peer1 = new Peer({ initiator: true });
  peer2 = new Peer();

  // when peer1 has signaling data, give it to peer2 somehow
  peer1.on('signal', data => {
    byId('signal1'       ).innerHTML = JSON.stringify(data, undefined, 2);
    byId('signal1_length').innerHTML = `Byte length: ${JSON.stringify(data).length.toString()}`;
    peer2.signal(data)
  });

  // when peer2 has signaling data, give it to peer1 somehow
  peer2.on('signal', data => {
    byId('signal2'       ).innerHTML = JSON.stringify(data, undefined, 2);
    byId('signal2_length').innerHTML = `Byte length: ${JSON.stringify(data).length.toString()}`;
    peer1.signal(data)
  });

  // wait for 'connect' event before using the data channel
  peer1.on('connect', () => {
    peer1.send('hey peer2, how is it going?')
  });

  // got a data channel message
  peer2.on('data', data => {
    worked = `${data}` === 'hey peer2, how is it going?';
    byId('channel_works').className = (worked? 'works' : 'not_works');
  });

}

window.onload = bootstrap;
