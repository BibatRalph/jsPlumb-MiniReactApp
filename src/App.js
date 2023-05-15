import React, { useEffect, useRef, useState } from "react";
import { jsPlumb } from "jsplumb";
import "./styles.css";

//OptionOjb
const OptObj = {
  isSource: true,
  isTarget: true,
  connector: ["Flowchart", { curviness: 175 }],
  connectorStyle: { strokeWidth: 1, stroke: "red" },
  hoverPaintStyle: {stroke: "red", strokeWidth: 2},
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
  }
];

function Element(item) {

  const { name, target, id, styleProps = {}, instance } = item;
  const element = useRef(null);

  useEffect(() => {
    instance &&
      instance.draggable(element.current, {
        grid: [14, 22],
        drag: function () {
          instance.repaintEverything();
        }
      });
    instance &&
    // Add endpoint
      instance.addEndpoint(element.current, { anchor: "Right" }, OptObj);
    instance &&
      instance.bind("connection", () => {
        alert("Connected");
      });
  }, [instance]);



  useEffect(() => {
    target &&
      instance &&
      instance.connect({
        source: id,
        target,
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

  useEffect(() => {
    // alert("Connected");
   }, []);

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
  
  const New = () => {
    setNodes((prev) => [
      ...prev,
      {
        name: "New",
        styleProps: { top: "260px", left: "420px" },
        id: `New_${Math.random()}`,
        instance: instance,
      }
      
    ]);
  };
  const DeleteOne = () => {
    //Target node ID 
    instance.remove(nodes[2].id, false, [false]);
  };
  
  const Delete = () => {
    instance.deleteEveryEndpoint();
  };

  return (
    <>

      <button onClick={New}>Add Element</button>
      <div></div>
      <button onClick={DeleteOne}>Delete</button>
      <button onClick={Delete}>Delete All</button>
      <div ref={container}>
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
