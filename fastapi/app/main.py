from fastapi import FastAPI
from modules.topics.routers import topics_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# registering the modules routers
app.include_router(topics_routes.router)

# Configuring CORSMiddleware
origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)