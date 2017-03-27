import React, { Component, PropTypes } from 'react';
import './FlowItem.css';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import jsPlumb from 'jsplumb/dist/js/jsplumb';
import $ from 'jquery';
import { updateCanvasItemPosition } from '../actions';
import { connect } from 'react-redux';
const jsPlum = jsPlumb.jsPlumb;
class FlowItem extends Component {
  handleClick() {
    // TODO Repaint is not working
    jsPlum.repaint('#flow-item-' + this.props.item.id);
  }
  handleActionClick() {
    this.props.openDialogHandler();
  }
  componentDidMount() {
    let id = 'flow-item-'+ this.props.item.id;
    let component = this;

    $(document).ready(function () {
      jsPlum.draggable(id, {
        handle: '.drag-handler',
        stop: function (e) {
          component.props.dispatch(updateCanvasItemPosition(component.props.item.id, e.pos[0], e.pos[1]))
        },
        containment: true
      });
      jsPlum.addEndpoint(id, {
          uuid: id + '-top',
          connector: [ "Bezier", { curviness:160 } ],
          endpoint: "Dot",
          isSource: false,
          isTarget: true,
          anchor: [ "TopCenter" ],
          connectorStyle: { strokeWidth:2, stroke:'#444' },
          maxConnections: -1
      });
      jsPlum.addEndpoint(id, {
          uuid: id + '-bottom',
          connector: [ "Bezier", { curviness:160 } ],
          endpoint: "Dot",
          isSource: true,
          isTarget: false,
          anchor: [ "BottomCenter" ],
          connectorStyle: { strokeWidth:2, stroke:'#444' }
      });

      setTimeout(function () {
        if (component.props.item.next) {
          let target = 'flow-item-' + component.props.item.next;
          jsPlum.connect({
            source: id,
            target: target,
            anchors:["Bottom", "Top"],
            connector: [ "Bezier", { curviness:160 } ],
            paintStyle: { strokeWidth:2, stroke:'#444' }
          });
        }
      }, 1000);

    });
  }
  render() {

    return (
      <div id={'flow-item-' + this.props.item.id} className='flow-item' style={{left: this.props.item.x, top: this.props.item.y}}>
        <Card>
          <CardHeader
            title={this.props.item.name}
            subtitle={this.props.item.type}
            actAsExpander={true}
            showExpandableButton={true}
            onClick={this.handleClick.bind(this)}
          />
          <CardActions>
            <div className='drag-handler' />
            <FlatButton label="Action1" onClick={this.handleActionClick.bind(this)}/>
            <FlatButton label="Action2" />
          </CardActions>
          <CardText expandable={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
        </Card>
      </div>
    );
  }
}

FlowItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  openDialogHandler: PropTypes.func.isRequired
};


const mapDispatchToProps = (dispatch) => {
  return {
    updateCanvasItemPosition: () => dispatch(updateCanvasItemPosition()),
  };
};

export default connect(mapDispatchToProps)(FlowItem);