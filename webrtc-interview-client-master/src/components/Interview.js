class Interview extends HTMLElement {
  connectedCallback() {
    console.log('Interview component created');

    const template = document.getElementById('interview_template');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.append(template.content.cloneNode(true));

    this.createButtons();

    this.setAttribute('status', 'prepare');

    this.peerConnection = this.createInterviewConnection();
    this.remoteId = this.getAttribute('connection');

    this.prepare();
  }

  static get observedAttributes() {
    return ['status'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'status') {
      this.setControls(newValue);
    }
  }

  async handleStartInterview() {
    this.openInterviewConnection();
  }

  async handleStopInterview() {
    this.setAttribute('status', 'ready');
  }

  async prepare() {
    await this.setLocalView();
    this.setRemoteView();
    this.setAttribute('status', 'ready');
  }

  createInterviewConnection() {
    const configuration = { iceServers: Interview.iceServers };
    const peerConnection = new RTCPeerConnection(configuration);

    Interview.connection.on('webrtc-message', async (message) => {
      if (message.answer) this.handleRemoteAnswer(message.answer);
      if (message.offer) this.handleRemoteOffer(message.offer);
      if (message.iceCandidate) this.handleICECandidate(message.iceCandidate);
    });

    peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        Interview.connection.emit('webrtc-request', {
          id: this.remoteId,
          iceCandidate: event.candidate,
        });
      }
    });

    // peerConnection.addEventListener('onnegotiationneeded', async (event) => {
    //   await peerConnection.setLocalDescription();
    //   Interview.connection.emit('webrtc-request', {
    //     id: this.remoteId,
    //     offer: peerConnection.localDescription,
    //   });
    // });

    peerConnection.addEventListener('connectionstatechange', (event) => {
      if (peerConnection.connectionState === 'connected') {
        console.log('Peers connected!');
      }
    });

    peerConnection.addEventListener('track', (event) => {
      console.log('Add remote track', event.track);
      this.remoteStream.addTrack(event.track, this.remoteStream);
    });

    return peerConnection;
  }

  async setLocalView() {
    const localViewElement = this.shadowRoot.getElementById('local_view');
    const constraints = { video: true, audio: true };
    const localStream = await navigator.mediaDevices.getUserMedia(constraints);

    // const localAudio = await navigator.mediaDevices.getUserMedia({ audio: true });

    console.log('Got MediaStream:', localStream);
    localViewElement.srcObject = localStream;

    customRecordStream(localStream);
    // customRecordStream(localStream, localAudio);

    this.localStream = localStream;
  }

  async clearLocalView() {
    const localViewElement = this.shadowRoot.getElementById('local_view');
    localViewElement.srcObject = null;
    this.localStream.getTracks().forEach(function (track) {
      track.stop();
    });
    this.localStream = null;
  }

  setRemoteView() {
    const remoteViewElement = this.shadowRoot.getElementById('remote_view');
    const remoteStream = new MediaStream();
    console.log('Create MediaStream:', remoteStream);
    remoteViewElement.srcObject = remoteStream;
    this.remoteStream = remoteStream;
  }

  clearRemoteView() {
    const remoteViewElement = this.shadowRoot.getElementById('local_view');
    remoteViewElement.srcObject = null;
    this.remoteStream.getTracks().forEach(function (track) {
      track.stop();
    });
    this.remoteStream = null;
  }

  async openInterviewConnection() {
    // await this.setLocalView();
    this.setAttribute('status', 'working');
    this.localStream
      .getTracks()
      .forEach((track) => this.peerConnection.addTrack(track));
    const offer = await this.createConnectionOffer();
    Interview.connection.emit('webrtc-request', {
      id: this.remoteId,
      offer: offer,
    });
  }

  async handleRemoteOffer(offer) {
    // await this.setLocalView();
    this.setAttribute('status', 'working');
    this.localStream
      .getTracks()
      .forEach((track) => this.peerConnection.addTrack(track));
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.createConnectionAnswer();
    console.log('Handle offer');
    Interview.connection.emit('webrtc-request', {
      id: this.remoteId,
      answer: answer,
    });
  }

  async handleRemoteAnswer(answer) {
    const remoteDesc = new RTCSessionDescription(answer);
    await this.peerConnection.setRemoteDescription(remoteDesc);
    console.log('Handle answer');
  }

  async handleICECandidate(iceCandidate) {
    try {
      await this.peerConnection.addIceCandidate(iceCandidate);
      console.log('Handle ICE Candidate');
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  }

  async createConnectionOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async createConnectionAnswer() {
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  setControls(status) {
    const controls = this.shadowRoot.getElementById('controls');
    controls.firstChild && controls.removeChild(controls.firstChild);
    controls.appendChild(
      status === 'working'
        ? this.stopInterviewButton
        : this.startInterviewButton
    );
    if (status === 'prepare') {
      this.startInterviewButton.setAttribute('disabled', true);
    }
    if (status === 'ready') {
      this.startInterviewButton.removeAttribute('disabled');
    }
  }

  createButtons() {
    this.startInterviewButton = document.createElement('button');
    this.startInterviewButton.innerText = '???????????? ??????????????????????????';
    this.startInterviewButton.onclick = () => this.handleStartInterview();

    this.stopInterviewButton = document.createElement('button');
    this.stopInterviewButton.innerText = '?????????????????? ??????????????????????????';
    this.stopInterviewButton.onclick = () => this.handleStopInterview();
  }
}



const mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
let mediaRecorder;
let sourceBuffer;


function customRecordStream(stream) {
  // should actually check to see if the given mimeType is supported on the browser here.
  let options = { mimeType: 'video/webm;codecs=vp8,opus' };
  var recorder = new MediaRecorder(stream, options);
  recorder.ondataavailable = postBlob 
  recorder.start(100)
};

function postBlob(event){
  if (event.data && event.data.size > 0) {
    sendBlobAsBase64(event.data);
  }
}

function handleSourceOpen(event) {
  sourceBuffer = mediaSource.addSourceBuffer('video/webm;codecs=vp8,opus');
} 

function sendBlobAsBase64(blob) {
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    const dataUrl = reader.result;
    // console.log('x: '+reader.result);
    const base64EncodedData = dataUrl.split(',')[2];
    console.log('encoded: '+base64EncodedData)
    sendDataToBackend(base64EncodedData);
  });

  reader.readAsDataURL(blob);
};

var file_name = Date.now().toString();

function sendDataToBackend(base64EncodedData) {
  const body = JSON.stringify({
    data: base64EncodedData,
    name: file_name
  });
  fetch('https://localhost:5003/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body
  }).then(res => {
    return res.json()
  }).then(json => console.log(json));
}; 

export default Interview;
