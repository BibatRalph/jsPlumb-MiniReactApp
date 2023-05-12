import React, { useEffect, useRef, useState } from "react";
import { jsPlumb } from "jsplumb";
import "./styles.css";

const endpointOptions = {
  isSource: true,
  isTarget: true,
  connector: ["Flowchart", { curviness: 175 }],
  connectorStyle: { strokeWidth: 1, stroke: "red" },
  scope: "blueline",
  dragAllowedWhenFull: false,
  maxConnections: 5,
  endpoint: "Dot" 
};

const primaryNodes = [
  {
    name: "1",
    styleProps: { top: "80px", left: "250px" },
    id: "e1"
  },
  {
    name: "2",
    styleProps: { top: "160px", left: "150px" },
    id: "e2",
    target: "e1"
  },
  {
    name: "3",
    styleProps: { top: "160px", left: "350px" },
    id: "e3",
    target: "e1"
  },
  {
    name: "4",
    styleProps: { top: "260px", left: "50px" },
    id: "e4",
    target: "e3"
  }
];

function Element(props) {
  const element = useRef(null);
  const { name, target, id, styleProps = {}, instance } = props;

  useEffect(() => {
    instance &&
      instance.draggable(element.current, {
        grid: [24, 32],
        drag: function () {
          instance.repaintEverything();
        }
      });
    instance &&
    // Add endpoint
      instance.addEndpoint(element.current, { anchor: "Right" }, endpointOptions);
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
    <div ref={element} id={id} className="box" style={styleProps}>
      <h2>{name}</h2>
    </div>
  );
}

export default function App() {
  const [nodes, setNodes] = useState(primaryNodes);
  const [instance, setInstance] = useState(null);
  const container = useRef(null);

  //GET INSTANCE OF JS PLUMB
  useEffect(() => {
    const Instnc = jsPlumb.getInstance({
      PaintStyle: {
        strokeWidth: 1,
        stroke: "#567567",
        outlineWidth: 1
      },
      Connector: ["Flowchart", { curviness: 20 }],
      Endpoint: ["Dot", { radius: 1 }],
      EndpointStyle: { fill: "#567567" },
      Anchors: ["Right", "Right"],
      Container: container.current
    });

    console.log(Instnc);
    //using useEffect to set instance
    setInstance(Instnc);
  }, []);

  const handleShowConnection = () => {
    const connections = instance.getAllConnections();
    console.log(connections);
  };

  const addCustomNode = () => {
    setNodes((prev) => [
      ...prev,
      {
        name: "New",
        styleProps: { top: "260px", left: "420px" },
        id: `New_${Math.random()}`,
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
      <div id="miniview" />
      <button onClick={handleShowConnection}>Console log Connection</button>
      <button onClick={addCustomNode}>Add Element</button>
      <button onClick={addDeleteNode}>Delete All</button>
      <div ref={container} id="drawing" className="App">
        {nodes.map((item) => {
          return (
            <Element
              name={item.name}
              styleProps={item.styleProps}
              id={item.id}
              target={item.target}
              instance={instance}
            />
          );
        })}
      </div>
    </>
  );
}
