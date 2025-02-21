# SecureCloudStorage

## Description
Solution...

## Running the solution

### Deploy the solution using Docker (recommended)
- Navigate to root directory of project
- Build using;
```bash
   npm run build --configuration=production  
```
- Deploy using;
```bash
  docker-compose up --build -d
```
- Access the solution; http://localhost:4200

### Running the solution locally
- Navigate to root directory of project
- Start json-server using;
```bash
   json-server --watch db.json --port 3000
```
- Build and serve using;
```bash
  ng serve
```
- Access the solution; http://localhost:4200

## Project Structure
```
.
├──  src/
│   ├── app/
│   │   ├── models/
│   │   │   └── ... # Classes for objects used
│   │   ├── pages/
│   │   │   ├── bucket-details
│   │   │   │   └── ... # Files for the page "bucket-details"
│   │   │   └── bucket-list
│   │   │       └── ... # Files for the page "bucket-list"
│   │   ├── services/
│   │   │   └── ... # Service logic implementation
│   │   └── ... # Files "app.component", "app.config", "app.routes"
│   └── ... # Files "index.html", "main.ts", "syles.css"
├── db.json 
└── Dockerfile
```

## Notes
