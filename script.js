

header {
    background: white;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
}

.mascot-container {
    display: flex;
    align-items: center;
    gap: 20px;
    max-width: 1400px;
    margin: 0 auto;
}

.mascot-image {
    width: 60px;
    height: 60px;
}


.admin-button {
    background-color: #FF9800;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: bold;
    min-width: 180px;
    justify-content: center;
}

.main-container {
    display: grid;
    grid-template-columns: 250px 1fr 300px;
    gap: 20px;
    padding: 20px;
    height: calc(100vh - 140px);
}
