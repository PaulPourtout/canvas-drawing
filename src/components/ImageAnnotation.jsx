import React, { Component } from 'react';
import PropTypes from 'prop-types';
import img from '../assets/full1.png';

export class ImageAnnotation extends Component {
    bgLayer;
    annotationLayer;

    componentDidMount() {
            this.createBgLayer();
            this.createAnnotationLayer();
    }

    createBgLayer = () => {
        const ctxBg = this.bgLayer.getContext('2d');
        const imageBg = new Image();

        imageBg.onload = () => {
            ctxBg.drawImage(imageBg, 0,0)
        }
        imageBg.src = img
    }

    createAnnotationLayer = () => {
        const ctxAnnotation = this.annotationLayer.getContext('2d');
        ctxAnnotation.font = "4rem Courier";
        ctxAnnotation.fillText('coucou', 50, 50);
    }

    render() {
        const canvasStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
        }

        const annotationStyle = {
            ...canvasStyle,
            zIndex: 30,
        }
        return (
            <div style={{position: 'relative'}}>
                <canvas ref={ref => this.annotationLayer = ref} width={700} height={300} style={annotationStyle}/>
                <canvas ref={ref => this.bgLayer = ref} width={700} height={300} style={canvasStyle}/>
            </div>
        );
    }

}
    ImageAnnotation.propTypes = {
        annotationPath: PropTypes.string.isRequired,

        // TODO: Custom validator, check if not more than one eraser/gonio/crop
        tools: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.oneOf([
                    "pencil",
                    "eraser",
                    "gonio",
                    "crop"
                ]).isRequired,
                color: PropTypes.string,
                sizes: PropTypes.arrayOf(PropTypes.number),
                defaultSize: PropTypes.number
            })
        ).isRequired,
        layers: PropTypes.arrayOf(PropTypes.string),
        backgroundImage: PropTypes.string.isRequired,
        initialCrop: PropTypes.object,
        selected: PropTypes.number,
        onItemSelected: PropTypes.func,
        onAngleSelected: PropTypes.func,
        onDoubleTap: PropTypes.func,
        onLongPress: PropTypes.func,
        finalSave: PropTypes.string,
        gonioMode: PropTypes.number

    };
