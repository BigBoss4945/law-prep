const fs = require('fs');

// Emulate flowData
const flowData = {
    nodes: [
        { id: "start", x: 600, y: 100 },
        { id: "is_prenup", x: 600, y: 400 }
    ],
    edges: [
        { from: "start", to: "is_prenup", type: "vertical" }
    ]
};

flowData.edges.forEach(edge => {
    const fromNode = flowData.nodes.find(n => n.id === edge.from);
    const toNode = flowData.nodes.find(n => n.id === edge.to);
    
    const fromW = 0, fromH = 0, toW = 0, toH = 0;
    
    let startPoint, endPoint, pathD;
    
    startPoint = { x: fromNode.x, y: fromNode.y + fromH / 2 };
    endPoint = { x: toNode.x, y: toNode.y - toH / 2 };
    const midY = startPoint.y + (endPoint.y - startPoint.y) / 2;
    pathD = `M ${startPoint.x} ${startPoint.y} L ${startPoint.x} ${midY} L ${endPoint.x} ${midY} L ${endPoint.x} ${endPoint.y}`;
    
    console.log(pathD);
});
