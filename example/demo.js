import React, { Component } from "react";
import ReactDOM from "react-dom";
import withCancellableFetch from "../src/index.js";

class FetchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchJson: '',
      promiseResult: false
    };
  }
  componentDidMount() {
    this.props.fetch("https://nghttp2.org/httpbin/delay/2").then((fetchResponse) => {
      fetchResponse.json().then((fetchJson) => {
        console.log(fetchJson);
        this.setState({ fetchJson });
      }).catch(console.log);
    }).catch(console.log);
    const fn = new Promise((resolve) => setTimeout(resolve, 3000));
    this.props.promise(fn).then(() => {
      this.setState({ promiseResult: true });
    }).catch(console.log);
  };

  render() {
    return (
      <div className="Fetch">
        <h1>Fetch Component Mounted!</h1>
        <div>Result of Query: {JSON.stringify(this.state.fetchJson)}</div>
        <div>Is promise resolved: {this.state.promiseResult ? 'Yes' : 'Nope'}</div>
      </div>
    );
  }
}

FetchComponent.defaultProps = {
  fetch: fetch,
  promise: Promise,
};

const FetchComponentHoc = withCancellableFetch(FetchComponent);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchComponent: false
    };
  }

  toggleFetchComponent() {
    this.setState({ fetchComponent: !this.state.fetchComponent });
  }

  render() {
    return (
      <div className="App">
        {this.state.fetchComponent ? (
          <FetchComponentHoc />
        ) : (
          <h1>Fetch Component unMounted!</h1>
        )}
        <button onClick={() => this.toggleFetchComponent()}>
          Toggle Fetch Component
        </button>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
