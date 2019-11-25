let p5;
let delegate;
let clickVertexFun;

let graph = {
    vertices: [],
    edges: [],
    destac: []
};

let target;
let mouseOver;
const offset = 15;

export function setDelegate(_delegate)
{
    delegate = _delegate;
}

export function DestacUpdaye(g) 
{
    graph.destac = g.edges;
}

export function MargeGraph(g) 
{
    for (let index = 0; index < g.vertices.length; index++) {
        const element = g.vertices[index];
        let u = graph.vertices.find(x => x.value == element.value);
        if (u != undefined)
        {
            u.d = element.d;
            u.f = element.f;
        }
    }
}

export function setOnclickVertex (_OnclickVertex) 
{
    clickVertexFun = _OnclickVertex;
}

export function AddVertex(value)
{
    let newVertex = {value: value, pos: [10, 50], d: 0.0, f: 0.0};
    if (graph.vertices.find(x => x.value === value) == undefined)
        graph.vertices.push(newVertex);
}

export function AddEdge(u, v, weight, n=true)
{
    if (!isNaN(weight))
    {
        let U = graph.vertices.find(x => x.value === u);
        let V = graph.vertices.find(x => x.value === v);

        if (U != undefined && V != undefined)
        {
            let UtoV = {from:U.value, to:V.value, w:parseFloat(weight)};
            graph.edges.push(UtoV);
        }
    }
    if (n)
        AddEdge(v, u, weight, false);
}

export function Vertices()
{
    let vertices = []
    graph.vertices.forEach(element => {vertices.push(element.value)});
    return vertices;
}

function notifyCurrentTime() 
{
    if (delegate !== undefined) 
    {
        const message = `Mouse Pos: ${[p5.mouseX, p5.mouseY]}
Target: ${JSON.stringify(target)}
MouseOver: ${JSON.stringify(mouseOver)}
Key (${p5.keyIsPressed}): ${p5.key}
Mouse (${p5.mouseIsPressed}): ${p5.mouseButton}
Vetices: ${JSON.stringify(graph.vertices)}
Edges: ${JSON.stringify(graph.edges)}`;
        delegate(message);
    }
}

function onClickVertex() {
    let g = {vertices: [], edges: []}
    graph.vertices.forEach(element => 
    {
        g.vertices.push({value: element.value})
    });
    g.edges = graph.edges;

    clickVertexFun({graph:g, orig:target.value});
}

function distance(p1, p2) 
{
    let dx = p1[0] - p2[0];
    let dy = p1[1] - p2[1];
    return ((dx**2) + (dy**2))**0.5;
}

function PointInLine(l1, l2, t) 
{
    let x = l1[0] + t * (l2[0] - l1[0]);
    let y = l1[1] + t * (l2[1] - l1[1]);

    return [x, y];
}

export function main(_p5) {
    p5 = _p5;

    // NOTE: Set up is here
    p5.setup = () =>
    {
        var canvas = p5.createCanvas(720, 400);
        canvas.parent("p5Canvas");
    }
    // NOTE: Draw is here
    p5.draw = () =>
    {
        p5.background(200);
        mouseOver = undefined;
        const OnScreen = 0 < p5.mouseX && p5.mouseX < 720 && 0 < p5.mouseY && p5.mouseY < 400;
        
        //Draw Lines
        for (let i = 0; i < graph.edges.length; i++) 
        {
            const edge = graph.edges[i];

            let from = graph.vertices.find(element => element.value == edge.from);
            let to = graph.vertices.find(element => element.value == edge.to);
            p5.fill(204, 101, 192, 255);
            p5.stroke(127, 63, 120);
            if (graph.destac.find(x => x.from == edge.from && x.to == edge.to) != undefined)
            {
                p5.strokeWeight(4);
                p5.fill(204, 150, 192, 255);
                p5.stroke(127, 200, 255);
            }
            
            p5.line(from.pos[0], from.pos[1], to.pos[0], to.pos[1]);
            p5.strokeWeight(1);
        }
        //Draw Arrows
        for (let i = 0; i < graph.edges.length; i++)
        {
            const edge = graph.edges[i];

            let from = graph.vertices.find(element => element.value == edge.from);
            let to = graph.vertices.find(element => element.value == edge.to);
            p5.fill(204, 101, 192, 255);
            p5.stroke(127, 63, 120);
            // this code is to make the arrow point
            p5.push() //start new drawing state
            var angle = p5.atan2(from.pos[1] - to.pos[1], from.pos[0] - to.pos[0]); //gets the angle of the line

            p5.translate(to.pos[0] + offset*p5.cos(angle), to.pos[1] + offset*p5.sin(angle)); //translates to the destination vertex

            p5.rotate(angle-p5.HALF_PI); //rotates the arrow point
            p5.triangle(-offset*0.5, offset, offset*0.5, offset, 0, -0/2); //draws the arrow point as a triangle
            p5.pop();

            let p = PointInLine(from.pos, to.pos, 0.75);
            p5.textSize(18);
            p5.fill(255, 255, 255, 255);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(edge.w, p[0], p[1]);
        }
        //Draw Vertex
        for (let i = 0; i < graph.vertices.length; i ++) 
        {
            let vertice = graph.vertices[i]
            let x = vertice.pos[0];
            let y = vertice.pos[1];
            
            p5.fill(204, 101, 192, 255);
            p5.stroke(127, 63, 120);
            p5.ellipse(x, y, offset*2, offset*2);

            p5.textSize(18);
            p5.fill(255, 255, 255, 255);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(vertice.value+"\n"+vertice.d+"/"+vertice.f, x, y);

            let d = distance([x, y], [p5.mouseX, p5.mouseY]);
            if (d < offset)
            {
                mouseOver = vertice;
            }
        }

        if (OnScreen)
        {
            if (p5.mouseIsPressed && p5.mouseButton === p5.LEFT)
            {
                if (target == undefined && mouseOver != undefined && target != mouseOver)
                {
                    target = mouseOver;
                    onClickVertex();
                }
            }

            if (p5.keyIsPressed === false)
            {
                if (p5.mouseIsPressed)
                {
                    if (p5.mouseButton === p5.LEFT)
                    {
                        if (target != undefined)
                        {
                            target.pos = [p5.mouseX, p5.mouseY];
                        }
                    }
                }
                else 
                {
                    target = undefined;
                }
            }
        }
        notifyCurrentTime();
    }
}