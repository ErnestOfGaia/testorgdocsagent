

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
    grid-template-columns: 250px minmax(400px, 1fr) minmax(400px, 1fr);
    gap: 20px;
    padding: 20px;
    height: calc(100vh - 140px);
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
}

.chat-section {
    background: white;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    width: 100%;
}

.message {
    margin: 10px 0;
    padding: 10px 15px;
    border-radius: 15px;
    max-width: 80%;
    word-wrap: break-word;
}

.bot-message {
    background-color: #f0f0f0;
    align-self: flex-start;
    margin-right: auto;
}

.user-message {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
    margin-left: auto;
}

.chat-controls {
    width: 100%;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.button-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.primary-button {
    background-color: #007bff;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.primary-button:hover {
    background-color: #0056b3;
}

.secondary-button {
    background-color: #6c757d;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.secondary-button:hover {
    background-color: #545b62;
}

.header-container {
    max-width: 1800px;
    margin: 0 auto;
    padding: 0 20px;
}
