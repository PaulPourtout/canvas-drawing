import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ImageAnnotation} from "./components/ImageAnnotation";

class App extends Component {
    state = {

    }

  render() {
        const imageUri = './assets/full1.png'
    return (
      <div>
          <ImageAnnotation
              annotationPath={this._lastValidPath}
              backgroundImage={imageUri}
          />
      </div>
    );
  }


}

export default App;
