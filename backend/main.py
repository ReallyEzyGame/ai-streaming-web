import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.firebase_config import init_firebase_admin
from app.routers.chat import router as chat_router
from app.routers.store import router as store_router


init_firebase_admin()


app = FastAPI(
    title='LLM Chatbox',
    version='1.0.0'
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}
@app.get("/health")
def health():
    return {"status": "OK", "code": 200}


app.include_router(chat_router)
app.include_router(store_router)



if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)