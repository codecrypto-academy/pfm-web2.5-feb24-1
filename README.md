# Ethereum Project: Ethereum Network Management Tool

## Overview
Proyecto_ETH is a comprehensive Ethereum network management tool that allows users to create, monitor, and interact with custom Ethereum networks. This full-stack application provides a user-friendly interface for blockchain enthusiasts and developers to experiment with and manage Ethereum-based networks.

## Key Features
- Custom Ethereum Network Creation: Generate and manage custom Ethereum networks with ease.
- Blockchain Explorer: View detailed information about blocks, transactions, and account balances.
- Real-time Network Monitoring: Keep track of your network's status and performance.
- Docker Integration: Easily deploy and manage Ethereum nodes using Docker.
- User-friendly Interface: Intuitive React-based frontend for seamless interaction.

## Technology Stack
- Frontend: React with Vite
- Backend: Node.js with Express
- Database: Oracle DB
- Blockchain Interaction: ethers.js and Web3.js
- Containerization: Docker
- Additional Tools: YAML for configuration, child_process for system commands

## Getting Started
1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up the Oracle database and update connection details in `back/db.js`
4. Start the backend server: `cd back && npm start`
5. Start the frontend development server: `cd front && npm run dev`

## Project Structure
- `/front`: React frontend application
- `/back`: Node.js backend server
- `/datos`: Data storage for network configurations and genesis files

## API Endpoints
- `/internalBlocks/:networkId`: Fetch blocks for a specific network
- `/transaction/:networkId/:txHash`: Get transaction details
- `/internalBlock/:networkId/:blockNumber`: Retrieve specific block information
- `/balance/:networkId/:address`: Check account balance

## Future Enhancements
- Multi-user support with authentication
- Advanced network analytics and visualization
- Integration with popular Ethereum tools and services

## Contributions
Contributions, issues, and feature requests are welcome. Feel free to check [issues page] if you want to contribute.

## License
[Specify your license here]

## Author
[Your Name]

---

This project showcases proficiency in full-stack development, blockchain technologies, and database management, making it an excellent addition to your curriculum.

Video demo: https://www.youtube.com/embed/HfN825apMRw


