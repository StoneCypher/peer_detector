const byId = id => document.getElementById(id);

let Peer,
    peer1,
    peer2,
    worked,

    browser,
    ver,
    os;





navigator.sayswho = function() {

  let ua = navigator.userAgent,
      tem,
      M  = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE '+(tem[1] || '');
    }

    if (M[1]=== 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem!= null) {
        return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
    }

    M = M[2]
      ? [M[1], M[2]]
      : [navigator.appName, navigator.appVersion, '-?'];

    if ( (tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }

    return M.join(' ');

};





function bootstrap() {

  document.getElementById('browser_id').innerHTML = navigator.sayswho();

  Peer  = window.SimplePeer;

  peer1 = new Peer({ initiator: true });
  peer2 = new Peer();

  const outcomes = document.getElementById('outcomes');



  // when peer1 has signaling data, give it to peer2 somehow
  peer1.on('signal', data => {

    const box = document.createElement('div');

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
    h.innerHTML = data.type === 'offer'? 'Opening offer' : 'Candidate offer';

    const l = document.createElement('p');
    l.innerHTML = `Byte length: ${JSON.stringify(data).length.toString()}`;

    const o = document.createElement('p');
    o.innerHTML = JSON.stringify(data, undefined, 2);

    [h,l,o].forEach(el => box.appendChild(el));
    outcomes.appendChild(box);

    peer2.signal(data);

  });



  // when peer2 has signaling data, give it to peer1 somehow
  peer2.on('signal', data => {

    const box = document.createElement('div');

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
    h.innerHTML = data.type === 'answer'? 'Opening response' : 'Candidate response';

    const l = document.createElement('p');
    l.innerHTML = `Byte length: ${JSON.stringify(data).length.toString()}`;

    const o = document.createElement('p');
    o.innerHTML = JSON.stringify(data, undefined, 2);

    [h,l,o].forEach(el => box.appendChild(el));
    outcomes.appendChild(box);

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
