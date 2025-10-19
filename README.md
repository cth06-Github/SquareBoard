# Square Board Creator

A web-based application that allows users to create and manipulate square boards with merge and subdivide functionality.

## Features

- **Square Board Generation**: Create square boards of any size (NxN grid)
- **Square Validation**: Ensures only square boards can be created (equal rows and columns)
- **Square Selection**: Click to select/deselect individual squares
- **Subdivide Function**: Split selected squares into smaller perfect squares (2x2, 3x3, 4x4, 5x5)
- **Merge Function**: Combine multiple selected squares into a larger square. You can select multiple squares at once (as opposed to selecting individually) by pressing and holding any 1 square, and dragging your cursor to select the rest.
- **Real-time Validation**: Error messages for invalid operations
- **Responsive Design**: Works on different screen sizes

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

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with JavaScript enabled

## Installation and Usage

1. Download all files to a folder
2. Double-click `index.html` to open in your default browser
3. No installation or setup required!

## Sharing

To share this app:
1. Zip all the files together
2. Send the zip file to the receiver
3. The receiver extracts the files and opens `index.html`
4. The app runs locally on their computer!

## Error Messages

- **"Rows and columns must be equal to create a square board!"**: Enter the same number for rows and columns
- **"Please select exactly one square to subdivide"**: Select only one square before subdividing
- **"Please select at least 2 squares to merge"**: Select multiple squares before merging
- **"Selected squares cannot be merged"**: The selected squares don't form a perfect square shape

## Examples

### Creating a 3x3 Board
- Enter 3
- Results in 9 squares arranged in a 3x3 grid

### Subdividing a Square
- Select one square
- Key in "2" (2x2) to split it into 4 smaller squares

### Merging Squares
- Select 4 adjacent squares in a 2x2 formation
- Click merge to combine them into one larger square

Enjoy creating and manipulating your square boards!
