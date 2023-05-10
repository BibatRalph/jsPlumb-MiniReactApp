import React, { useEffect, useRef, useState } from "react";
import { jsPlumb } from "jsplumb";
import "./styles.css";

const endpointOptions = {
  isSource: true,
  isTarget: true,
  connector: ["Bezier", { curviness: 175 }],
  connectorStyle: { strokeWidth: 2, stroke: "red" },
  scope: "blueline",
  dragAllowedWhenFull: false,
  maxConnections: 5,
  endpoint: "Dot"
};

const primaryNodes = [
  {
    name: "first",
    styleProps: { top: "80px", left: "250px" },
    id: "e1"
  },
  {
    name: "second",
    styleProps: { top: "160px", left: "150px" },
    id: "e2",
    target: "e1"
  },
  {
    name: "third",
    styleProps: { top: "160px", left: "350px" },
    id: "e3",
    target: "e1"
  },
  {
    name: "forth",
    styleProps: { top: "260px", left: "50px" },
    id: "e4",
    target: "e2"
  },
  {
    name: "fifth",
    styleProps: { top: "260px", left: "250px" },
    id: "e5",
    target: "e2"
  }
];

// let secondInstance = jsPlumb.getInstance({
//   PaintStyle: {
//     strokeWidth: 2,
//     stroke: "#567567",
//     outlineWidth: 1
//   },
//   Connector: ["Bezier", { curviness: 20 }],
//   Endpoint: ["Dot", { radius: 5 }],
//   EndpointStyle: { fill: "#567567" },
//   Anchors: ["TopCenter", "BottomCenter"]
//   // Container: container.current
// });

function NewEl(props) {
  const el = useRef(null);
  const { name, target, id, styleProps = {}, instance } = props;

  useEffect(() => {
    instance &&
      instance.draggable(el.current, {
        grid: [24, 32],
        drag: function () {
          instance.repaintEverything();
        }
      });
    instance &&
      instance.addEndpoint(el.current, { anchor: "Left" }, endpointOptions);
  }, [instance]);

  useEffect(() => {
    target &&
      instance &&
      instance.connect({
        source: id,
        target,
        scope: "someScope"
      });
  }, [target, id, instance]);

  return (
    <div ref={el} id={id} className="box" style={styleProps}>
      <h2>{name}</h2>
    </div>
  );
}

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [nodes, setNodes] = useState(primaryNodes);
  const [instance, setInstance] = useState(null);
  const container = useRef(null);

  useEffect(() => {
    const toolkit = jsPlumb.getInstance({
      PaintStyle: {
        strokeWidth: 2,
        stroke: "#567567",
        outlineWidth: 1
      },
      Connector: ["Bezier", { curviness: 20 }],
      Endpoint: ["Dot", { radius: 1 }],
      EndpointStyle: { fill: "#567567" },
      Anchors: ["TopCenter", "BottomCenter"],
      Container: container.current
    });

    console.log(toolkit);
    // var surface = jsPlumb.render({
    //   container: container.current,
    //   miniview:{
    //     container:"someMiniContainerId"
    //   }
    // });
    // var miniview = surface.getMiniview();

    setInstance(toolkit);
  }, []);

  const handleZoomIn = () => {
    const newZoomLevel = zoomLevel + 0.25;
    instance.setZoom(newZoomLevel);
    console.log(instance.getZoom());
    console.log(instance);
    setZoomLevel(newZoomLevel);
  };

  const handleZoomOut = () => {
    const newZoomLevel = zoomLevel - 0.25;
    instance.setZoom(newZoomLevel);
    setZoomLevel(newZoomLevel);
  };

  const handleShowConnection = () => {
    const connections = instance.getAllConnections();
    console.log(connections);
  };

  const addCustomNode = () => {
    setNodes((prev) => [
      ...prev,
      {
        name: "custom",
        styleProps: { top: "260px", left: "420px" },
        id: `custom_${Math.random()}`,
        target: "e2",
        instance: instance
      }
    ]);
  };

  const addDeleteNode = () => {
    const connections = instance.deleteEveryEndpoint();
    console.log(connections);
  };

  return (
    <>
      <div ref={container} id="drawing" className="App">
        {nodes.map((item) => {
          return (
            <NewEl
              name={item.name}
              styleProps={item.styleProps}
              id={item.id}
              target={item.target}
              instance={instance}
            />
          );
        })}
      </div>
      <div id="miniview" />
      <button onClick={handleZoomIn}>zoom in</button>
      <button onClick={handleZoomOut}>zoom out</button>
      <button onClick={handleShowConnection}>Connections</button>

      <button onClick={addCustomNode}>Add Node</button>
      <button onClick={addDeleteNode}>Delete All connections</button>
    </>
  );
}
