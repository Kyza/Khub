function navigate(location) {
  window.location = location;
}

class Root extends React.Component {
  render() {
    return (
      <div id="body">
        <Titlebar />
        <Content theme="theme-dark" />
      </div>
    );
  }
}

class Titlebar extends React.Component {
  render() {
    return (
      <div id="titlebar">
        <Hamburger />
        <Hiddenbar id="hiddenbar" />
      </div>
    );
  }
}

class Hamburger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    return (
      <div id="hamburger" open={this.state.open} onClick={() => {
        if (this.state.open) {
          this.setState({ open: false });
        } else {
          this.setState({ open: true });
        }
        console.log(this);
      }}>
        <div class="meat"></div>
        <div class="meat"></div>
        <div class="meat"></div>
        <div class="meat"></div>
      </div>
    );
  }
}

class Hiddenbar extends React.Component {
  render() {
    return (
      <div id={this.props.id}>
        <TitlebarButton id="home" text="Home" onClick={() => {
          navigate("https://kyza.gq/");
        }} />
        <TitlebarButton id="khub" text="Khub • BetterDiscord" onClick={() => {
          navigate("https://kyza.gq/discord/");
        }} />
        <TitlebarButton id="discord" text="Discord" onClick={() => {
          navigate("https://kyza.gq/discord/");
        }} />
      </div>
    );
  }
}

class TitlebarButton extends React.Component {
  render() {
    return (
      <div id={this.props.id} class="titlebarButton" onClick={this.props.onClick}>
        <span class="ghostSpan"></span>
        <span class="ghostSpan"></span>
        <span class="ghostSpan"></span>
        <span class="ghostSpan"></span>
        {this.props.text}
      </div>
    );
  }
}

class Content extends React.Component {
  render() {
    return (
      <div id="content" class={this.props.theme}>
      oof
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.body);
