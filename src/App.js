import logo from './logo.svg';
import './App.css';


import pcloudSdk from 'pcloud-sdk-js';

// Create `client` using an oAuth token:
const client = pcloudSdk.createClient('access_token');

// then list root folder's contents:
client.listfolder(0).then((fileMetadata) => {
  console.log(fileMetadata);
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
