import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reducers'
// import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { loadState, saveState } from './utils/localStorage';
import './index.css'

const persistedStore = loadState();
const store = createStore(
  reducer,
  persistedStore,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  saveState({
    canvasItems: store.getState().canvasItems
  });
});

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
//injectTapEventPlugin();

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
