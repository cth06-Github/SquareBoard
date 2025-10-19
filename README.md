# Square Board Creator (Vibe coding)

A local application that allows users to create and manipulate square boards with merge and subdivide functionality. <br>


## Important!: Why this exists
I was creating sqaureboard diagrams for [a particular use case](#how-to-use). I shared an online platform that I used to help me to do so, which essentially allow users to draw lines on the [virtual graph paper](https://virtual-graph-paper.com/). I was asked: <br>


> "Can this online platform create squareboard diagrams automatically?" <br>
> Me: "Err no. It's not that advance?" <br>

However, that conversation led me to think: if there truly isn't any existing tools out there, **why not create one?**<br>

With the advancement of Generative AI, I thought it will be a good opportunitity to explore the capabilities of Agentic AI and gain first-hand experience how powerful it is. <br>

And so I used **Claude Sonnet 4, Agent mode**. This code repository houses the code created by Claude, and a bit of my input. 

The main consideration behind choosing HTML, CSS and Vanilla JS was the ease of setting up the local application without the need for additional installations (as opposed to the use of docker). 

## What I learn + Moving Forward
Once again, I was deeply amazed by Claude's power. Some pointers:
- It is better to prompt the app features one by one instead of all in one shot.
- Human intervenetion is still helpful as opposed to fully relying on prompting for the AI to rectify itself.
- There are still some bugs with the UI design -- the alignment and responsive design isn't the most ideal (not yet solved)
- Moving forward: To read and internalise the code. It may seem to work, but The danger of vibe coding is to code without fully understanding what the code does. 
- Code quality: Writing almost all the code in a _single_ file does not seem to be the best idea. (Readability and Modularity issue)


## Installation and Usage

1. Download all files to a folder
2. Double-click `index.html` to open in your default browser
3. Done. No installation or setup required!

## Sharing

To share this app:
1. Zip all the files together
2. Send the zip file to the receiver
3. The receiver extracts the files and opens `index.html`
4. The app runs locally on their computer!

## Technical Details

- **HTML5**: Structure and layout
- **CSS3**: Styling with responsive design
- **Vanilla JavaScript**: All functionality implemented without external libraries
- **No Dependencies**: Runs entirely in the browser without any server or external resources

## File Structure

```
Square Board Creator/
├── index.html          # Main HTML file
├── style.css           # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```


## Features

- **Square Board Generation**: Create square boards of any size (NxN grid)
- **Square Validation**: Ensures only square boards can be created (equal rows and columns)
- **Square Selection**: Click to select/deselect individual squares
- **Subdivide Function**: Split selected squares into smaller perfect squares (e.g. 2x2, 3x3, 4x4, 5x5)
- **Merge Function**: Combine multiple selected squares into a larger square. You can select multiple squares at once (as opposed to selecting individually) by pressing and holding any 1 square, and dragging your cursor to select the rest.
- **Real-time Validation**: Error messages for invalid operations
- **Responsive Design**: Works on different screen sizes **(partially implemented)**

## How to Use

### 1. Creating a Board
1. Enter the number for both "Rows" and "Columns" (e.g. 5 for a 5x5 board)
2. Click "Create Square Board"

### 2. Selecting Squares
- Click on any square to select it (highlighted in yellow)
- Click again to deselect
- You can select multiple squares by clicking on different squares

### 3. Subdividing Squares
1. Select exactly **one** square
2. Click "Subdivide Selected Square"
3. Key in how many squares to subdivide into. Maximum allowed number is 20x20.
4. Click "Confirm Subdivide"

### 4. Merging Squares
1. Select **two or more** squares
2. Click "Merge Selected Squares"
3. The squares will merge if they form a perfect square shape
4. If they don't form a square, you'll get an error message

### 5. Clearing Selection
- Click "Clear Selection" to deselect all squares

## Rules and Constraints

- **Square Board Only**: The main board must always be square (NxN)
- **Square Shapes Only**: All individual squares and merged areas must be perfect squares
- **Equal Size for Merging**: You can only merge squares of the same size
- **Contiguous Merging**: Merged squares must be adjacent and form a square grid
- **Perfect Square Subdivision**: Squares can only be subdivided into perfect square numbers (4, 9, 16, 25, etc.)
