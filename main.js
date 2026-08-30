
// ===============================
// ELEMENTS
// ===============================
const gridOpacityInput = 
document.getElementById('grid-opacity')
const gridColorInput =
    document.getElementById('grid-color');
const lineThicknessInput =
    document.getElementById('line-thickness');
 const paperSizeInput = 
 document.getElementById('paper-size');
  
const canvas =
    document.getElementById('canvas');
 
const ctx =
    canvas.getContext('2d');
 
const gridCanvas =
    document.getElementById('grid');
 
const gridCtx =
    gridCanvas.getContext('2d');
 
const uploadFile =
    document.getElementById('upload-file');
 
const browseBtn =
    document.querySelector('.browse-btn');
 
const rowsInput =
    document.getElementById('rows');
 
const columnsInput =
    document.getElementById('columns');
 
const grayscaleBtn = 
document.getElementById('grayscale-btn');
 
const downloadBtn =
    document.getElementById('download-btn');
 
const revertBtn =
    document.getElementById('revert-btn');
 
const cellWidthInput =
    document.getElementById('cell-width');
 
const cellHeightInput =
    document.getElementById('cell-height');
 
const MAX_WIDTH = 800;
const MAX_HEIGHT = 700;
 
const MIN_GRID_LINES = 1;
const MAX_GRID_LINES = 100;
// ===============================
// VARIABLES
// ===============================
let isGrayscale = false;
let img = new Image();
 
let filename = '';
 
 
// ===============================
// BROWSE BUTTON
// ===============================
 
browseBtn.addEventListener('click', () => {
 
    uploadFile.click();
 
});
 
 
// ===============================
// DRAW IMAGE
// ===============================
function drawImage() {
 
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
 
 
    if (isGrayscale) {
 
        ctx.filter =
            'grayscale(100%)';
 
    } else {
 
        ctx.filter =
            'none';
 
    }
 
 
    ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
    );
 
 
    // Reset filter
    ctx.filter =
        'none';
 
}
 
 
// ===============================
// IMAGE UPLOAD
// ===============================
 
uploadFile.addEventListener('change', () => {
 
    const file =
        uploadFile.files[0];
 
    if (!file) return;
 
 
    filename =
        file.name;
 
 
    const reader =
        new FileReader();
 
 
    reader.addEventListener('load', () => {
 
        img =
            new Image();
 
 
        img.onload = function () {
 
    let width = img.width;
    let height = img.height;
 
 
    // Calculate scaling ratio
    const scale =
        Math.min(
            MAX_WIDTH / width,
            MAX_HEIGHT / height,
            1
        );
 
 
    // Resize image while keeping its proportions
    width =
        Math.round(width * scale);
 
    height =
        Math.round(height * scale);
 
 
    // Image canvas
    canvas.width =
        width;
 
    canvas.height =
        height;
 
 
    // Grid canvas
    gridCanvas.width =
        width;
 
    gridCanvas.height =
        height;
 
 
    // Reset any grayscale state on new upload
    isGrayscale = false;
    grayscaleBtn.textContent = 'Grayscale';
    grayscaleBtn.classList.remove('active');
 
 
    // Draw image
    drawImage();
 
 
    // Draw grid
    updateGrid();
 
};
 
        img.src =
            reader.result;
 
    });
 
 
    reader.readAsDataURL(file);
 
});
 
// ===============================
// UPDATE GRID
// ===============================
 
function clampGridValue(rawValue) {
 
    let value =
        Math.round(Number(rawValue));
 
    if (Number.isNaN(value)) {
        value = MIN_GRID_LINES;
    }
 
    return Math.min(
        Math.max(value, MIN_GRID_LINES),
        MAX_GRID_LINES
    );
}
 
// Keep the cell-width/cell-height fields showing the actual
// applied cell size (may differ slightly from a requested value
// once rows/columns are rounded and clamped).
function syncCellSizeInputs(rows, columns) {
 
    if (!gridCanvas.width || !gridCanvas.height) {
        return;
    }
 
    cellWidthInput.value =
        Math.round(gridCanvas.width / columns);
 
    cellHeightInput.value =
        Math.round(gridCanvas.height / rows);
}
 
// A cell can't be smaller than 2px, or bigger than the canvas itself.
function clampCellValue(rawValue, canvasDimension) {
 
    let value =
        Math.round(Number(rawValue));
 
    if (Number.isNaN(value) || value < 2) {
        value = 2;
    }
 
    return Math.min(value, canvasDimension || value);
}
 
function updateGrid() {
 
    const rows =
        clampGridValue(rowsInput.value);
 
    const columns =
        clampGridValue(columnsInput.value);
 
    // Reflect the corrected value back into the input so the
    // user can see what was actually applied (e.g. 1000 -> 100)
    rowsInput.value = rows;
    columnsInput.value = columns;
 
    syncCellSizeInputs(rows, columns);
 
    drawGrid(
        rows,
        columns
    );
}
 
// Driven by the cell-width/cell-height inputs: figures out how
// many rows/columns are needed to hit (roughly) that cell size,
// then draws the grid the same way updateGrid() does.
function updateGridFromCellSize() {
 
    if (!gridCanvas.width || !gridCanvas.height) {
        return;
    }
 
    const cellWidth =
        clampCellValue(cellWidthInput.value, gridCanvas.width);
 
    const cellHeight =
        clampCellValue(cellHeightInput.value, gridCanvas.height);
 
    const columns =
        clampGridValue(Math.round(gridCanvas.width / cellWidth));
 
    const rows =
        clampGridValue(Math.round(gridCanvas.height / cellHeight));
 
    rowsInput.value = rows;
    columnsInput.value = columns;
 
    syncCellSizeInputs(rows, columns);
 
    drawGrid(
        rows,
        columns
    );
}
// DRAW GRID
function drawGrid(rows, columns) {
 
    console.log("GRID DRAWING");
 
 
    // Clear previous grid
    gridCtx.clearRect(
        0,
        0,
        gridCanvas.width,
        gridCanvas.height
    );
    // GRID APPEARANCE
 
    gridCtx.strokeStyle =
        gridColorInput.value;
 
    gridCtx.lineWidth =
        Number(lineThicknessInput.value);
 
    gridCtx.globalAlpha =
        Number(gridOpacityInput.value) / 100;
 
    // CALCULATE CELL SIZE
 
    const cellWidth =
        gridCanvas.width / columns;
 
    const cellHeight =
        gridCanvas.height / rows;
 
    // VERTICAL LINES
 
    for (let i = 0; i <= columns; i++) {
 
        const x =
            i * cellWidth;
 
        gridCtx.beginPath();
 
        gridCtx.moveTo(
            x,
            0
        );
 
        gridCtx.lineTo(
            x,
            gridCanvas.height
        );
 
        gridCtx.stroke();
    }
 
    // HORIZONTAL LINES
 
    for (let i = 0; i <= rows; i++) {
 
        const y =
            i * cellHeight;
 
        gridCtx.beginPath();
 
        gridCtx.moveTo(
            0,
            y
        );
 
        gridCtx.lineTo(
            gridCanvas.width,
            y
        );
 
        gridCtx.stroke();
    }
 
 
    // Reset opacity
    gridCtx.globalAlpha = 1;
}
grayscaleBtn.addEventListener('click', () => {
 
    isGrayscale = !isGrayscale;
 
    drawImage();
 
 
    if (isGrayscale) {
 
        grayscaleBtn.textContent =
            'Colour';
 
        grayscaleBtn.classList.add(
            'active'
        );
 
    } else {
 
        grayscaleBtn.textContent =
            'Grayscale';
 
        grayscaleBtn.classList.remove(
            'active'
        );
 
    }
 
});
 
// ===============================
// GRID CONTROLS
// ===============================
 
rowsInput.addEventListener(
    'input',
    updateGrid
);
 
 
columnsInput.addEventListener(
    'input',
    updateGrid
);
 
 
gridColorInput.addEventListener(
    'input',
    updateGrid
);
lineThicknessInput.addEventListener(
    'input',
    updateGrid
);
 
gridOpacityInput.addEventListener(
    'input',
    updateGrid
);
 
cellWidthInput.addEventListener(
    'input',
    updateGridFromCellSize
);
 
cellHeightInput.addEventListener(
    'input',
    updateGridFromCellSize
);
 
// ===============================
// DOWNLOAD (merges image + grid canvases)
// ===============================
 
if (downloadBtn) {
 
    downloadBtn.addEventListener('click', () => {
 
        if (!img.src) {
            alert('Please upload an image first.');
            return;
        }
 
        // Build an offscreen canvas that merges image + grid
        const exportCanvas =
            document.createElement('canvas');
 
        exportCanvas.width = canvas.width;
        exportCanvas.height = canvas.height;
 
        const exportCtx =
            exportCanvas.getContext('2d');
 
        // Draw the image layer (with grayscale filter if active)
        exportCtx.filter =
            isGrayscale ? 'grayscale(100%)' : 'none';
 
        exportCtx.drawImage(
            img,
            0,
            0,
            exportCanvas.width,
            exportCanvas.height
        );
 
        exportCtx.filter = 'none';
 
        // Draw the grid layer on top
        exportCtx.drawImage(
            gridCanvas,
            0,
            0
        );
 
        // Trigger download
        const link =
            document.createElement('a');
 
        const baseName =
            filename ? filename.replace(/\.[^/.]+$/, '') : 'gridscale-image';
 
        link.download = `${baseName}-grid.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
    });
 
}
 
// ===============================
// REVERT (undo grayscale, back to original)
// ===============================
 
if (revertBtn) {
 
    revertBtn.addEventListener('click', () => {
 
        if (!img.src) {
            return;
        }
 
        isGrayscale = false;
 
        grayscaleBtn.textContent = 'Grayscale';
        grayscaleBtn.classList.remove('active');
 
        drawImage();
    });
 
}
 // paper sizes

//const paperSizes = {
   // A1: { width: 59.4, height: 84.1 },
    //A2: { width: 42.0, height: 59.4 },
    //A3: { width: 29.7, height: 42.0 },   // fixed
    //A4: { width: 21.0, height: 29.7 },   // fixed
    

 paperSizeInput.addEventListener('change', () => {
    const selectedPaper = 
    paperSizes[paperSizeInput.value];


    console.log(
        "Width:",
        selectedPaper.width,
        "cm"
    );

    console.log(
        "Height:",
        selectedPaper.height,
        "cm"
    );
 });
