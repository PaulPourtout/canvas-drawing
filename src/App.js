import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ImageAnnotation} from "./components/ImageAnnotation";
import img from './assets/front.png';
import annotationFile1 from './assets/Drawing.png';
import annotationFile2 from './assets/42a26d47-f67a-4018-98c8-1b47a6eae015.png';

class App extends Component {
    state = {
        selected: 0
    }

    annotations = [annotationFile1, annotationFile2]

    handleSelectedItem = (item) => {
        this.setState({selected: item})
    }

  render() {
    return (
      <div>
          <ImageAnnotation
              selected={this.state.selected}
              onItemSelected={this.handleSelectedItem}
              annotationPath={this.annotations[this.state.selected]}
              backgroundImage={img}
              tools={[
                  {type:"pencil", defaultSize:4, color: '#5298D5' },
                  {type:"pencil", defaultSize:4, color: '#D55745' },
                  { type:"eraser", defaultSize: 8 }
              ]}
          />
      </div>
    );
  }


}

export default App;
