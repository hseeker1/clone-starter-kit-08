import React from 'react';
import './App.css';
import { HashRouter, Route } from 'react-router-dom';
import About from './routes/About';
import Home from './routes/Home';
import dev_test from './routes/dev_test';
import Navigation from './components/Navigation';
import Detail from './routes/Detail';
import Login from './routes/Login' ;

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Route path="/" exact={true} component={Home} />
      <Route path="/about" component={About} />
      <Route path="/dev_test" component={dev_test} />
      <Route path="/movie-detail/:url_content_id/:url_content_title" component={Detail} />
      <Route path="/login" component={Login} />
      <Route path="/img/*" />
    </HashRouter>
  );
}

export default App;
