// import {Connections} from 'index';
import debounce from "lodash.debounce";
import React, { PureComponent } from "react";
import { AutoSizer } from "react-virtualized";
import { Graph, Node, NodeContent } from "jsplumb-react";
// import './Diagram.css';

const style = {
  height: 50
};

const nodes = {
  node1: {
    label: "node 1",
    style: {
      left: 272.5,
      top: 233
    }
  },
  node2: {
    label: "node 2",
    style: {
      left: 672.5,
      top: 233
    }
  }
};

const connections = [
  {
    id: "connection1",
    source: "node1",
    target: "node2"
  }
];

export const IDiagramState = {
  connections: height,
  maxScale,
  minScale,
  nodes,
  scale,
  width,
  xOffset,
  yOffset
};

export default class Diagram extends PureComponent {
  state = {
    connections,
    height: 500,
    maxScale: 2,
    minScale: 0.25,
    nodes,
    scale: 1,
    width: 500,
    xOffset: 0.0,
    yOffset: 0.0
  };

  handleResize = debounce(
    ({ height, width }) => {
      this.setState({ height, width });
    },
    400,
    { trailing: true }
  );

  render() {
    const children = Object.keys(this.state.nodes).map((id) => {
      const { label, type } = this.state.nodes[id];

      return (
        <Node
          id={id}
          key={id}
          onDrop={this.handleDrop}
          style={this.state.nodes[id].style}
          styleName="node"
        >
          {this.children}
        </Node>
      );
    });

    return (
      <div styleName="canvas">
        <AutoSizer onResize={this.handleResize}>{() => null}</AutoSizer>
        <Graph
          connections={this.state.connections}
          height={this.state.height}
          id={"simpleDiagram"}
          maxScale={this.state.maxScale}
          minScale={this.state.minScale}
          onAddConnection={this.handleAddConnection}
          onRemoveConnection={this.handleRemoveConnection}
          onPanEnd={this.handlePanEnd}
          onZoom={this.handleZoom}
          scale={this.state.scale}
          width={this.state.width}
          xOffset={this.state.xOffset}
          yOffset={this.state.yOffset}
        >
          {children}
        </Graph>
      </div>
    );
  }

  children = (id, drag) => (
    <NodeContent
      id={id}
      label={this.state.nodes[id].label}
      onRemoveNode={this.handleClose}
      style={style}
    >
      {this.state.nodes[id].label || id}
    </NodeContent>
  );

  handleClose = (nodeId) => {
    if (confirm("Remove node '" + nodeId + "'?")) {
      const { [nodeId]: omit, ...remaining } = this.state.nodes;
      this.setState({
        connections: this.state.connections.filter(
          (connection) =>
            connection.source !== nodeId && connection.target !== nodeId
        ),
        nodes: remaining
      });
    }
  };

  handlePanEnd = (xOffset, yOffset) => {
    this.setState({ xOffset, yOffset });
  };

  handleZoom = (scale) => {
    this.setState({ scale });
  };

  handleDrop = (id, x, y) => {
    this.setState({
      nodes: {
        ...this.state.nodes,
        [id]: { ...this.state.nodes[id], x, y }
      }
    });
  };

  handleAddConnection = (source, id, target) => {
    this.setState({
      connections: [...this.state.connections, { id, source, target }]
    });
  };

  handleRemoveConnection = (id, source) => {
    if (confirm("Remove connection '" + id + "'?")) {
      this.setState({
        connections: this.state.connections.filter(
          (connection) => connection.id !== id
        )
      });
    }
  };
}
