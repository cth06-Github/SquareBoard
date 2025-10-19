class SquareBoardCreator {
    constructor() {
        this.board = null;
        this.boardData = [];
        this.selectedSquares = new Set();
        this.squareIdCounter = 0;
        this.currentSize = 0;
        
        // Drag selection state
        this.isDragging = false;
        this.dragStartSquare = null;
        this.dragCurrentSquares = new Set();
        this.mouseDownTime = 0;
        this.mouseDownPosition = null;
        
        this.initializeEventListeners();
        
        // Initialize board preview
        setTimeout(() => {
            this.updateBoardPreview();
        }, 50);
        
        // Auto-create 5x5 board on load
        setTimeout(() => {
            this.createBoard();
        }, 100);
    }

    initializeEventListeners() {
        document.getElementById('createBoard').addEventListener('click', () => this.createBoard());
        document.getElementById('subdivideBtn').addEventListener('click', () => this.showSubdivideOptions());
        document.getElementById('mergeBtn').addEventListener('click', () => this.mergeSquares());
        document.getElementById('clearSelection').addEventListener('click', () => this.clearSelection());
        document.getElementById('confirmSubdivide').addEventListener('click', () => this.confirmSubdivide());
        document.getElementById('cancelSubdivide').addEventListener('click', () => this.hideSubdivideOptions());
        
        // Add input listener for subdivide size preview
        document.getElementById('subdivideSize').addEventListener('input', () => this.updateSubdividePreview());
        
        // Add input listener for board size preview
        document.getElementById('boardSize').addEventListener('input', () => this.updateBoardPreview());
        
        // Add zoom slider listener
        document.getElementById('zoomInput').addEventListener('input', () => this.updateZoom());
        
        // Allow Enter key to create board
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && document.activeElement.type === 'number') {
                if (document.activeElement.id === 'subdivideSize') {
                    this.confirmSubdivide();
                } else if (document.activeElement.id === 'zoomInput') {
                    this.updateZoom();
                } else {
                    this.createBoard();
                }
            }
        });
        
        // Add global mouse event listeners for drag selection
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.dragStartSquare = null;
                this.dragCurrentSquares.clear();
            }
        });
        document.addEventListener('mouseleave', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.dragStartSquare = null;
                this.dragCurrentSquares.clear();
            }
        });
    }

    showError(message) {
        // Hide subdivision options if they're open
        this.hideSubdivideOptions();
        
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 2000);
    }

    showSuccess(message) {
        // Hide subdivision options if they're open
        this.hideSubdivideOptions();
        
        // Use the existing success message element
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.classList.add('show');
            setTimeout(() => {
                successDiv.classList.remove('show');
            }, 2000);
        }
    }

    createBoard() {
        const boardSize = parseInt(document.getElementById('boardSize').value);

        // Validate input
        if (!boardSize || boardSize < 1) {
            this.showError('Please enter a valid number for board size (minimum 1).');
            return;
        }

        this.currentSize = boardSize;
        this.squareIdCounter = 0;
        this.selectedSquares.clear();
        this.initializeBoardData(boardSize);
        this.renderBoard();
        
        // Show actions section
        document.getElementById('actionsGroup').style.display = 'block';
        this.showSuccess(`Successfully created a ${boardSize}×${boardSize} square board!`);
    }

    initializeBoardData(size) {
        this.boardData = [];
        this.squares = new Map(); // Store all squares separately
        
        for (let row = 0; row < size; row++) {
            this.boardData[row] = [];
            for (let col = 0; col < size; col++) {
                const squareData = {
                    id: this.squareIdCounter++,
                    row: row,
                    col: col,
                    size: 1,
                    subdivided: false,
                    parent: null
                };
                this.boardData[row][col] = squareData.id;
                this.squares.set(squareData.id, squareData);
            }
        }
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        // Use the true LCM of 2,3,4,5,6,7 = 420 for perfect alignment of all subdivision types
        const cellsPerUnit = 420;
        const gridResolution = this.currentSize * cellsPerUnit;
        boardElement.style.gridTemplateColumns = `repeat(${gridResolution}, 1fr)`;
        boardElement.style.gridTemplateRows = `repeat(${gridResolution}, 1fr)`;

        // Render each square with exact positioning
        this.squares.forEach(squareData => {
            const square = this.createSquareElement(squareData);
            
            // Calculate exact grid positions to ensure perfect fit
            const startCol = Math.round(squareData.col * cellsPerUnit) + 1;
            const startRow = Math.round(squareData.row * cellsPerUnit) + 1;
            const spanCol = Math.round(squareData.size * cellsPerUnit);
            const spanRow = Math.round(squareData.size * cellsPerUnit);
            
            // Ensure spans are at least 1 and within bounds
            const finalSpanCol = Math.max(1, Math.min(spanCol, gridResolution - startCol + 1));
            const finalSpanRow = Math.max(1, Math.min(spanRow, gridResolution - startRow + 1));
            
            square.style.gridColumn = `${startCol} / span ${finalSpanCol}`;
            square.style.gridRow = `${startRow} / span ${finalSpanRow}`;
            
            boardElement.appendChild(square);
        });
        
        // Update the square counter
        this.updateSquareCounter();
    }

    createSquareElement(squareData) {
        const square = document.createElement('div');
        square.className = 'square';
        square.dataset.id = squareData.id;
        square.dataset.row = squareData.row;
        square.dataset.col = squareData.col;

        // Visual indicators based on square properties
        if (squareData.subdivided) {
            square.classList.add('subdivided');
        }
        
        if (squareData.size > 1) {
            square.classList.add('merged');
        }

        // Add drag selection event listeners
        square.addEventListener('mousedown', (e) => this.startDragSelection(e, square, squareData));
        square.addEventListener('mouseenter', () => this.updateDragSelection(square, squareData));
        square.addEventListener('mouseup', (e) => this.endDragSelection(e, square, squareData));
        
        return square;
    }

    toggleSquareSelection(element, squareData) {
        const squareId = squareData.id;
        
        if (this.selectedSquares.has(squareId)) {
            this.selectedSquares.delete(squareId);
            element.classList.remove('selected');
        } else {
            this.selectedSquares.add(squareId);
            element.classList.add('selected');
        }
        
        this.updateActionButtons();
    }

    startDragSelection(event, element, squareData) {
        event.preventDefault();
        this.mouseDownTime = Date.now();
        this.mouseDownPosition = { x: event.clientX, y: event.clientY };
        this.dragStartSquare = squareData;
        this.dragCurrentSquares.clear();
        
        // Don't immediately start dragging - wait for movement
        this.isDragging = false;
    }

    updateDragSelection(element, squareData) {
        // Only start dragging if mouse has been held down for a bit or moved significantly
        if (!this.dragStartSquare) return;
        
        if (!this.isDragging) {
            // Check if we should start dragging (mouse held down and moved)
            const timeDiff = Date.now() - this.mouseDownTime;
            if (timeDiff > 100) { // 100ms threshold
                this.isDragging = true;
                // Clear previous selection when starting new drag
                this.clearSelection();
                
                // Add the starting square to selection
                this.dragCurrentSquares.add(this.dragStartSquare.id);
                this.selectedSquares.add(this.dragStartSquare.id);
                const startElement = document.querySelector(`[data-id="${this.dragStartSquare.id}"]`);
                if (startElement) {
                    startElement.classList.add('selected');
                }
            } else {
                return; // Don't update selection yet
            }
        }
        
        // Clear current drag selection
        this.dragCurrentSquares.forEach(id => {
            const square = document.querySelector(`[data-id="${id}"]`);
            if (square) {
                square.classList.remove('selected');
                this.selectedSquares.delete(id);
            }
        });
        this.dragCurrentSquares.clear();
        
        // Calculate rectangular selection from start to current square
        const startSquare = this.dragStartSquare;
        const endSquare = squareData;
        
        const minRow = Math.min(startSquare.row, endSquare.row);
        const maxRow = Math.max(startSquare.row, endSquare.row);
        const minCol = Math.min(startSquare.col, endSquare.col);
        const maxCol = Math.max(startSquare.col, endSquare.col);
        
        // Select all squares in the rectangular area
        this.squares.forEach((square, id) => {
            if (square.row >= minRow && square.row <= maxRow && 
                square.col >= minCol && square.col <= maxCol) {
                
                // Check if the square overlaps with the selection area
                if (square.row + square.size > minRow && square.row < maxRow + endSquare.size &&
                    square.col + square.size > minCol && square.col < maxCol + endSquare.size) {
                    
                    this.dragCurrentSquares.add(id);
                    this.selectedSquares.add(id);
                    
                    const squareElement = document.querySelector(`[data-id="${id}"]`);
                    if (squareElement) {
                        squareElement.classList.add('selected');
                    }
                }
            }
        });
        
        this.updateActionButtons();
    }

    endDragSelection(event, element, squareData) {
        if (this.isDragging) {
            // End drag selection
            this.isDragging = false;
            this.dragStartSquare = null;
            this.dragCurrentSquares.clear();
        } else if (this.dragStartSquare) {
            // This was a single click - toggle selection
            this.toggleSquareSelection(element, squareData);
        }
        
        // Reset drag state
        this.dragStartSquare = null;
        this.mouseDownTime = 0;
        this.mouseDownPosition = null;
    }

    updateActionButtons() {
        const subdivideBtn = document.getElementById('subdivideBtn');
        const mergeBtn = document.getElementById('mergeBtn');
        
        // Enable subdivide only if exactly one square is selected
        subdivideBtn.disabled = this.selectedSquares.size !== 1;
        
        // Enable merge only if more than one square is selected
        mergeBtn.disabled = this.selectedSquares.size <= 1;
    }

    showSubdivideOptions() {
        if (this.selectedSquares.size !== 1) {
            this.showError('Please select exactly one square to subdivide.');
            return;
        }
        
        document.getElementById('subdivideOptions').style.display = 'block';
        this.updateSubdividePreview(); // Update preview when showing options
    }

    hideSubdivideOptions() {
        document.getElementById('subdivideOptions').style.display = 'none';
    }

    updateSubdividePreview() {
        const gridSize = parseInt(document.getElementById('subdivideSize').value) || 2;
        const totalSquares = gridSize * gridSize;
        
        document.getElementById('subdividePreview').textContent = gridSize;
        document.getElementById('subdivideSquareCount').textContent = `grid (${totalSquares} squares)`;
    }

    updateBoardPreview() {
        const boardSize = parseInt(document.getElementById('boardSize').value) || 5;
        const totalSquares = boardSize * boardSize;
        
        document.getElementById('boardPreview').textContent = boardSize;
        document.getElementById('boardSquareCount').textContent = `board (${totalSquares} squares)`;
    }

    updateZoom() {
        const zoomValue = parseInt(document.getElementById('zoomInput').value) || 100;
        
        // Apply zoom to board using CSS transform
        const board = document.getElementById('board');
        if (board) {
            board.style.transform = `scale(${zoomValue / 100})`;
            board.style.transformOrigin = 'top center';
        }
    }

    updateSquareCounter() {
        const totalSquares = this.squares.size;
        const counterElement = document.getElementById('squareCount');
        if (counterElement) {
            counterElement.textContent = totalSquares;
        }
    }

    confirmSubdivide() {
        const gridSize = parseInt(document.getElementById('subdivideSize').value);
        
        if (!gridSize || gridSize < 2) {
            this.showError('Please enter a valid grid size (minimum 2).');
            return;
        }

        if (gridSize > 20) {
            this.showError('Grid size too large (maximum 20).');
            return;
        }

        // Get the selected square
        const selectedId = Array.from(this.selectedSquares)[0];
        const selectedSquare = this.findSquareById(selectedId);
        
        if (!selectedSquare) {
            this.showError('Selected square not found.');
            return;
        }

        // Subdivide the square
        this.subdivideSquare(selectedSquare, gridSize);
        this.hideSubdivideOptions();
        this.clearSelection();
        
        const totalSquares = gridSize * gridSize;
        this.showSuccess(`Square subdivided into ${gridSize}×${gridSize} grid (${totalSquares} squares)!`);
    }

    findSquareById(id) {
        return this.squares.get(id) || null;
    }

    subdivideSquare(square, gridSize) {
        const startRow = square.row;
        const startCol = square.col;
        const squareSize = square.size;
        const newSize = squareSize / gridSize;

        // Remove the original square
        this.squares.delete(square.id);
        
        // Clear the board area
        for (let r = Math.floor(startRow); r < Math.floor(startRow + squareSize); r++) {
            for (let c = Math.floor(startCol); c < Math.floor(startCol + squareSize); c++) {
                if (this.boardData[r] && this.boardData[r][c] !== undefined) {
                    this.boardData[r][c] = null;
                }
            }
        }

        // Create exactly gridSize x gridSize new squares with precise positioning
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const newRow = startRow + (i * newSize);
                const newCol = startCol + (j * newSize);
                
                const newSquare = {
                    id: this.squareIdCounter++,
                    row: newRow,
                    col: newCol,
                    size: newSize,
                    subdivided: true,
                    parent: square.id
                };
                
                // Store the new square
                this.squares.set(newSquare.id, newSquare);
            }
        }

        this.renderBoard();
    }

    mergeSquares() {
        if (this.selectedSquares.size <= 1) {
            this.showError('Please select at least 2 squares to merge.');
            return;
        }

        const selectedSquareData = Array.from(this.selectedSquares).map(id => this.findSquareById(id)).filter(sq => sq !== null);
        
        if (!this.canMergeSquares(selectedSquareData)) {
            this.showError('Selected squares cannot be merged. They must form a perfect square shape with equal-sized squares.');
            return;
        }

        this.performMerge(selectedSquareData);
        this.clearSelection();
        this.showSuccess('Squares successfully merged!');
    }

    canMergeSquares(squares) {
        if (squares.length === 0) return false;
        if (squares.length === 1) return false; // Can't merge a single square
        
        // Create a fine-grained grid to check coverage
        // Use the smallest square size to determine grid resolution
        const minSize = Math.min(...squares.map(sq => sq.size));
        const gridResolution = minSize;
        
        // Find the bounding rectangle of all squares
        const allPoints = [];
        squares.forEach(sq => {
            allPoints.push({ row: sq.row, col: sq.col });
            allPoints.push({ row: sq.row + sq.size, col: sq.col + sq.size });
        });
        
        const minRow = Math.min(...allPoints.map(p => p.row));
        const maxRow = Math.max(...allPoints.map(p => p.row));
        const minCol = Math.min(...allPoints.map(p => p.col));
        const maxCol = Math.max(...allPoints.map(p => p.col));
        
        const width = maxRow - minRow;
        const height = maxCol - minCol;
        
        // Must form a square shape
        if (Math.abs(width - height) > 0.001) return false;
        
        // Create a coverage grid to check if all area is covered exactly once
        const gridSize = Math.round(width / gridResolution);
        const coverageGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
        
        // Mark all covered areas
        for (const square of squares) {
            const startRow = Math.round((square.row - minRow) / gridResolution);
            const endRow = Math.round((square.row + square.size - minRow) / gridResolution);
            const startCol = Math.round((square.col - minCol) / gridResolution);
            const endCol = Math.round((square.col + square.size - minCol) / gridResolution);
            
            // Check bounds
            if (startRow < 0 || endRow > gridSize || startCol < 0 || endCol > gridSize) {
                return false;
            }
            
            // Check for overlaps and mark coverage
            for (let r = startRow; r < endRow; r++) {
                for (let c = startCol; c < endCol; c++) {
                    if (coverageGrid[r][c]) {
                        return false; // Overlap detected
                    }
                    coverageGrid[r][c] = true;
                }
            }
        }
        
        // Check if entire grid is covered
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (!coverageGrid[r][c]) {
                    return false; // Gap detected
                }
            }
        }
        
        return true;
    }

    performMerge(squares) {
        const positions = squares.map(sq => ({ row: sq.row, col: sq.col, size: sq.size }));
        
        const minRow = Math.min(...positions.map(p => p.row));
        const minCol = Math.min(...positions.map(p => p.col));
        const maxRow = Math.max(...positions.map(p => p.row + p.size));
        const maxCol = Math.max(...positions.map(p => p.col + p.size));
        
        const newSize = Math.max(maxRow - minRow, maxCol - minCol);
        
        // Remove all selected squares
        squares.forEach(square => {
            this.squares.delete(square.id);
        });
        
        // Clear the board area
        for (let r = Math.floor(minRow); r < Math.ceil(maxRow) && r < this.currentSize; r++) {
            for (let c = Math.floor(minCol); c < Math.ceil(maxCol) && c < this.currentSize; c++) {
                if (this.boardData[r] && this.boardData[r][c] !== undefined) {
                    this.boardData[r][c] = null;
                }
            }
        }
        
        // Create the new merged square
        const mergedSquare = {
            id: this.squareIdCounter++,
            row: minRow,
            col: minCol,
            size: newSize,
            subdivided: false,
            parent: null
        };
        
        // Store the merged square
        this.squares.set(mergedSquare.id, mergedSquare);
        
        // Mark the board cells this square occupies
        for (let r = Math.floor(minRow); r < Math.ceil(minRow + newSize) && r < this.currentSize; r++) {
            for (let c = Math.floor(minCol); c < Math.ceil(minCol + newSize) && c < this.currentSize; c++) {
                if (this.boardData[r]) {
                    this.boardData[r][c] = mergedSquare.id;
                }
            }
        }
        
        this.renderBoard();
    }

    clearSelection() {
        this.selectedSquares.clear();
        document.querySelectorAll('.square.selected').forEach(square => {
            square.classList.remove('selected');
        });
        this.updateActionButtons();
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SquareBoardCreator();
});
