class SessionLengthControl extends React.Component {
  render() {
    return (
      React.createElement("div", { className: "lengthControl" },
      React.createElement("div", { id: "break-label" },
      React.createElement("p", null, "Break Length"),
      React.createElement("div", { className: "demo" },
      React.createElement("button", { onClick: this.props.breakLengthControl,
        id: "break-decrement", value: "-" }, "-"),
      React.createElement("div", { id: "break-length" }, this.props.breakLength),
      React.createElement("button", { onClick: this.props.breakLengthControl,
        id: "break-increment", value: "+" }, "+"))),


      React.createElement("div", { id: "session-label" },
      React.createElement("p", null, "Session Length"),
      React.createElement("button", { onClick: this.props.sessionLengthControl,
        id: "session-decrement", value: "-" }, "-"),
      React.createElement("div", { id: "session-length" }, this.props.sessionLength),
      React.createElement("button", { onClick: this.props.sessionLengthControl,
        id: "session-increment", value: "+" }, "+"))));



  }}
;

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timeDisplay: '25:00',
      timerType: 'session',
      isOn: false,
      time: 1500,
      start: 0 };

    this.lengthControl = this.lengthControl.bind(this);
    this.changeBrkLength = this.changeBrkLength.bind(this);
    this.changeSessLength = this.changeSessLength.bind(this);
    this.reset = this.reset.bind(this);
    this.tickingClock = this.tickingClock.bind(this);
    this.displayTimer = this.displayTimer.bind(this);
    this.stopStart = this.stopStart.bind(this);
    this.switchSession = this.switchSession.bind(this);
    this.playSound = this.playSound.bind(this);
    this.audio = React.createRef();
  }
  changeBrkLength(e) {
    this.lengthControl('breakLength', e.target.value, this.state.breakLength, 'session');
  }
  changeSessLength(e) {
    this.lengthControl('sessionLength', e.target.value, this.state.sessionLength, 'break');
  }
  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.isOn) {
      return;
    }
    if (this.state.timerType == timerType) {
      if (sign == '-' && currentLength != 1) {
        this.setState({
          [stateToChange]: currentLength - 1 });

      } else if (
      sign == '+' && currentLength != 60) {
        this.setState({ [stateToChange]: currentLength + 1 });
      }
    } else {
      if (sign == '-' && currentLength != 1) {
        this.setState({ [stateToChange]: currentLength - 1,
          time: currentLength * 60 - 60 });
      } else if (sign == '+' && currentLength != 60) {
        this.setState({
          [stateToChange]: currentLength + 1,
          time: currentLength * 60 + 60 });

      }
    }
  }
  stopStart() {
    if (this.state.isOn) {
      clearInterval(this.intervalID);
      this.setState({
        isOn: false });

    } else {
      this.tickingClock();
      this.setState({
        isOn: true });

    }
  }
  reset() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerType: 'session',
      time: 1500,
      isOn: false });

    clearInterval(this.intervalID);
    this.audio.current.pause();
    this.audio.current.currentTime = 0;
  }
  tickingClock() {
    this.setState({
      time: this.state.time,
      start: Date.now() + this.state.time * 1000,
      isOn: true });

    this.intervalID = setInterval(() => {this.setState({
        time: (this.state.start - Date.now()) / 1000 }),

      this.switchSession();
    }, 1);

  }
  switchSession() {
    let timer = this.state.time;
    this.playSound(timer);
    if (timer < 0) {
      if (this.state.timerType == 'session') {
        clearInterval(this.intervalID);
        this.setState({
          timerType: 'break',
          time: this.state.breakLength * 60 });

        this.tickingClock();

      } else {
        clearInterval(this.intervalID);
        this.setState({
          timerType: 'session',
          time: this.state.sessionLength * 60 });

        this.tickingClock();
      }
    }
  }

  displayTimer() {
    let minutes = Math.floor(this.state.time / 60);
    let secondsLeft = Math.floor(this.state.time % 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    secondsLeft = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
    return minutes + ':' + secondsLeft;
  }
  playSound(_timer) {
    this.audio.current.play();
  }
  render() {
    return (
      React.createElement("div", null,
      React.createElement("div", { className: "main-name" }, "Pomodoro Clock"),
      React.createElement(SessionLengthControl, {
        breakLengthControl: this.changeBrkLength,
        sessionLengthControl: this.changeSessLength,
        breakLength: this.state.breakLength,
        sessionLength: this.state.sessionLength }),
      React.createElement("div", { className: "timerCircle" },
      React.createElement("div", { id: "timer-label" }, this.state.timerType),
      React.createElement("div", { id: "time-left" }, this.displayTimer())),

      React.createElement("div", { className: "timerControl" },
      React.createElement("button", { onClick: this.stopStart, id: "start_stop" },
      React.createElement("i", { className: "fas fa-play" }),
      React.createElement("i", { className: "fas fa-pause" })),
      React.createElement("button", { onClick: this.reset,
        id: "reset" }, React.createElement("i", { className: "fas fa-redo" }))),

      React.createElement("audio", { id: "beep", ref: this.audio, src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3" })));


  }}

ReactDOM.render(React.createElement(Timer, null), document.getElementById('app'));