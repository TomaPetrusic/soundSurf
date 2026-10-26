from database import engine, Base
import models

def create_tables():
   try:
      Base.metadata.create_all(bind=engine)
   except Exception as e:
      print("Greska: {e}")

if __name__ == "__main__":
   create_tables()