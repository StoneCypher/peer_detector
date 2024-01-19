
const byId = id => document.getElementById(id);

let Peer,
    peer1,
    peer2,
    worked,

    browser,
    ver,
    os;





function bootstrap() {

  document.getElementById('browser_id').innerHTML = `${platform.name} ${platform.version} ${platform.os}`;

  Peer  = window.SimplePeer;

  peer1 = new Peer({ initiator: true });
  peer2 = new Peer();

  const preferred_outcomes = document.getElementById('preferred_outcomes'),
        outcomes           = document.getElementById('outcomes');



  // when peer1 has signaling data, give it to peer2 somehow
  peer1.on('signal', data => {

    const box       = document.createElement('div'),
          is_opener = data.type === 'offer';

    switch (data.type) {

      case 'offer':
        box.className = 'box boxOffer';
        break;

      case 'answer':
        box.className = 'box boxResponse';
        break;

      default:
        box.className = 'box boxNothing';
        break;

    }

    const h = document.createElement('h1');
    h.innerHTML = is_opener? 'Opening offer' : 'Candidate offer';

    const l = document.createElement('p');
    l.innerHTML = `Byte length: ${JSON.stringify(data).length.toString()}`;

    const o = document.createElement('p');
    o.innerHTML = JSON.stringify(data, undefined, 2);

    [h,l,o].forEach(el => box.appendChild(el));
    (is_opener? preferred_outcomes : outcomes).appendChild(box);

    peer2.signal(data);

  });



  // when peer2 has signaling data, give it to peer1 somehow
  peer2.on('signal', data => {

    const box       = document.createElement('div'),
          is_opener = data.type === 'answer';

    switch (data.type) {

      case 'offer':
        box.className = 'box boxOffer';
        break;

      case 'answer':
        box.className = 'box boxResponse';
        break;

      default:
        box.className = 'box boxNothing';
        break;

    }

    const h = document.createElement('h1');
    h.innerHTML = is_opener? 'Opening response' : 'Candidate response';

    const l = document.createElement('p');
    l.innerHTML = `Byte length: ${JSON.stringify(data).length.toString()}`;

    const o = document.createElement('p');
    o.innerHTML = JSON.stringify(data, undefined, 2);

    [h,l,o].forEach(el => box.appendChild(el));
    (is_opener? preferred_outcomes : outcomes).appendChild(box);

    peer1.signal(data);

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
