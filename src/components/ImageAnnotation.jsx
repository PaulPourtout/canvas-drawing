import React, { PureComponent} from 'react';
import PropTypes from 'prop-types';

export class ImageAnnotation extends PureComponent {
    bgLayer;
    annotationLayer;
    ctxBg;
    ctxAnnotation;
    lastX;
    lastY;

    state = {
        isDrawing: false,
    }


    componentDidMount() {
            this.createBgLayer();
            this.createAnnotationLayer();

            this.annotationLayer.addEventListener('mousemove', this.draw)
            this.annotationLayer.addEventListener('mousedown', (e) => {
                this.setState({isDrawing: true});
                [this.lastX, this.lastY] = [e.offsetX, e.offsetY]
            })
            this.annotationLayer.addEventListener('mouseup', () => this.setState({isDrawing: false}))
            // this.annotationLayer.addEventListener('mouseout', () => {this.setState({isDrawing: false})})
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.annotationPath !== this.props.annotationPath) {

            this.createAnnotationLayer();
        }
    }


    draw = (e) => {
        const tool = this.props.tools[this.props.selected];
        if (!this.state.isDrawing) return;

        if (tool.type === 'eraser') this.ctxAnnotation.globalCompositeOperation = "destination-out";
        else this.ctxAnnotation.globalCompositeOperation = "source-over";

        this.ctxAnnotation.strokeStyle = tool.color;
        this.ctxAnnotation.lineWidth = tool.defaultSize || 4;
        this.ctxAnnotation.beginPath();
        this.ctxAnnotation.moveTo(this.lastX, this.lastY);
        this.ctxAnnotation.lineTo(e.offsetX, e.offsetY);
        this.ctxAnnotation.stroke();

        [this.lastX, this.lastY] = [e.offsetX, e.offsetY]
    }

    createBgLayer = () => {
        this.ctxBg = this.bgLayer.getContext('2d');
        const imageBg = new Image();

        imageBg.onload = () => {
            console.log('bg naturalHeight:', imageBg.naturalHeight, 'naturalWidth :', imageBg.naturalWidth)
            this.ctxBg.drawImage(imageBg, 0,0)
        }
        imageBg.src = this.props.backgroundImage
    }

    createAnnotationLayer = () => {
        this.ctxAnnotation = this.annotationLayer.getContext('2d');
        this.ctxAnnotation.lineJoin = 'round';
        this.ctxAnnotation.lineCap = 'round';

        const annotationDraw = new Image();

        annotationDraw.onload = () => {
            console.log('Annotation naturalHeight:', annotationDraw.naturalHeight, 'naturalWidth :', annotationDraw.naturalWidth)
            this.ctxAnnotation.drawImage(annotationDraw, 0, 0);
        }
        annotationDraw.src = this.props.annotationPath;

    }


    render() {
        console.log('PROPS', this.props.annotationPath)

        const isSelectedPain = (index, color1, color2) => {
            return this.props.selected === index
                ? {backgroundColor: color1, color: color2}
                : {backgroundColor: color2, color: color1}
        }

        const WIDTH = 840;
        const HEIGHT = 840;
        return (
            <div style={{display: 'flex'}}>
                <div style={{...Style.painColumnStyle}}>
                {
                    this.props.tools.map((tool, index) => <button
                            key={`${tool.color}-${index}`}
                            onClick={() => this.props.onItemSelected(index)}
                            style={ Object.assign( {}, Style.buttonStyle, tool.type === 'pencil'
                                ? isSelectedPain(index, tool.color, "#FFF")
                                : isSelectedPain(index, "#000", '#FFF')
                            )}
                        >{tool.type === 'pencil' ? index + 1 : 'Eraser'}</button>
                    )
                }
                </div>
                <div style={{position: 'relative', width: WIDTH, height: HEIGHT, cursor: 'default'}}>
                    <canvas ref={ref => this.annotationLayer = ref} width={WIDTH} height={HEIGHT} style={{...Style.canvasStyle, zIndex: 30}}/>
                    <canvas ref={ref => this.bgLayer = ref} width={WIDTH} height={HEIGHT} style={Style.canvasStyle}/>
                </div>

            </div>
        );
    }

}

export const Style = {
    canvasStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
    }, buttonStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        display: 'block',
        outline: 'none',
        boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
        border: 'none',
        fontSize: 18,
        marginBottom: 20,
    }, painColumnStyle: {
        padding: 10,
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


